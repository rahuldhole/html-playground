import { task, streams } from "@trigger.dev/sdk/v3";
import { OpenRouter } from '@openrouter/sdk'

import { SYSTEM_PROMPT } from "../shared/prompt";

export interface AIGenPayload {
  prompt: string;
  code: string;
  apiKey: string;
  model?: string;
  systemPrompt?: string;
}

export const aiGenerateTask = task({
  id: "ai-generate",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 2000,
    maxTimeoutInMs: 10000,
    factor: 2
  },
  maxDuration: 3600, // Maximum allowed duration (1 hour)
  run: async (payload: AIGenPayload) => {
    const { prompt, code, apiKey, model, systemPrompt: customSystemPrompt } = payload;

    const sdk = new OpenRouter({
      apiKey: apiKey,
    });

    const systemPrompt = customSystemPrompt || SYSTEM_PROMPT;

    const messages = [
      {
        role: "system" as const,
        content: [
          {
            type: "text" as const,
            text: systemPrompt,
            cache_control: { type: "ephemeral" as const }
          }
        ]
      },
      {
        role: "user" as const,
        content: `### 📂 Context: Current Code in Editor
${code ? code : "(Editor is empty - New Project)"}

### 💡 User Request
${prompt}

### 🚀 Implementation Task
Apply the request to the context above. 
1. **Prioritize Libraries**: Check the preferred CDN list and use professional libraries (Swiper, Chart.js, GSAP, etc.) instead of writing custom vanilla code for complex features.
2. **Use Mock APIs**: Use the provided API list (DummyJSON, etc.) for any data-driven features.
3. **Elevate Design**: Ensure a complete, premium, and responsive product.

REMINDER: Output ONLY raw code. No markdown code blocks.`
      }
    ];

    try {
      let stream;
      try {
        stream = await sdk.chat.send({
          appTitle: "Minimalist HTML IDE",
          chatRequest: {
            model: model || "openrouter/free", 
            messages: messages,
            stream: true
          }
        });
      } catch (error: any) {
        // If rate limited and we weren't already using the fallback
        if ((error.status === 429 || error.code === 429) && model && model !== "openrouter/free") {
          console.log(`Model ${model} rate limited, falling back to openrouter/free`);
          stream = await sdk.chat.send({
            appTitle: "Minimalist HTML IDE",
            chatRequest: {
              model: "openrouter/free", 
              messages: messages,
              stream: true
            }
          });
        } else {
          throw error;
        }
      }

      let accumulated = '';
      let hasStartedCode = false;
      
      for await (const chunk of stream) {
        const reasoning = (chunk.choices?.[0]?.delta as any)?.reasoning_content;
        const content = chunk.choices?.[0]?.delta?.content;

        if (reasoning) {
          console.log(`[AI Task] Appending reasoning (${reasoning.length} chars)`);
          await streams.append("ai-reasoning", reasoning);
        }

        if (content) {
          if (!hasStartedCode) {
            console.log(`[AI Task] First code chunk received`);
            hasStartedCode = true;
          }
          accumulated += content;
          
          // Publish the chunk to the Trigger.dev stream
          await streams.append("ai-output", content);
        }
      }
      console.log(`[AI Task] Stream finished. Total length: ${accumulated.length}`);

      // Clean up markdown blocks if the AI ignored instructions
      const cleaned = accumulated.replace(/```(?:html|css|js|javascript|vue|typescript|ts|jsx|tsx|json)?\n?/gi, '').replace(/```$/g, '');

      return {
        code: cleaned
      };
    } catch (error: any) {
      console.error('OpenRouter Error in Task:', error);
      throw error;
    }
  },
});

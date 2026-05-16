import { task, streams } from "@trigger.dev/sdk/v3";
import { OpenRouter } from '@openrouter/sdk'

import { TECHNICAL_CONSTRAINTS } from "../shared/prompt";

export interface AIGenPayload {
  prompt: string;
  code: string;
  apiKey: string;
  model?: string;
  systemPrompt?: string;
  mode?: 'edit' | 'full';
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
    const { prompt, code, apiKey, model, systemPrompt: customSystemPrompt, mode } = payload;

    const sdk = new OpenRouter({
      apiKey: apiKey,
    });

    const messages = [
      {
        role: "system" as const,
        content: [
          {
            type: "text" as const,
            text: customSystemPrompt || TECHNICAL_CONSTRAINTS,
            cache_control: { type: "ephemeral" as const }
          }
        ]
      },
      {
        role: "user" as const,
        content: `### 📂 Context: Current Code in Editor
${code ? code : "(Editor is empty - New Project)"}

${prompt}`
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

      let finalCode = accumulated;
      
      if (mode === 'edit') {
        const blocks = accumulated.split('<<<<<<< SEARCH');
        let currentCode = code || '';
        
        for (let i = 1; i < blocks.length; i++) {
          const block = blocks[i];
          if (!block) continue;
          
          const parts = block.split('=======');
          if (parts.length < 2) continue;
          
          const searchPart = parts[0];
          const replacePart = parts[1];
          if (searchPart === undefined || replacePart === undefined) continue;

          const search = searchPart.trim();
          const replaceWithParts = replacePart.split('>>>>>>> REPLACE');
          if (replaceWithParts.length < 1) continue;
          
          const replacementPart = replaceWithParts[0];
          if (replacementPart === undefined) continue;
          
          const replacement = replacementPart.trim();
          
          if (currentCode.includes(search)) {
            currentCode = currentCode.replace(search, replacement);
          } else {
            console.warn("[AI Task] Could not find exact match for search block");
          }
        }
        finalCode = currentCode;
      } else {
        // Clean up markdown blocks if the AI ignored instructions
        finalCode = accumulated.replace(/```(?:html|css|js|javascript|vue|typescript|ts|jsx|tsx|json)?\n?/gi, '').replace(/```$/g, '');
      }

      return {
        code: finalCode
      };
    } catch (error: any) {
      console.error('OpenRouter Error in Task:', error);
      throw error;
    }
  },
});

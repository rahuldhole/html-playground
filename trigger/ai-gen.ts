import { task, streams } from "@trigger.dev/sdk/v3";
import { OpenRouter } from '@openrouter/sdk'

import { SYSTEM_PROMPT } from "../server/utils/prompt";

export interface AIGenPayload {
  prompt: string;
  code: string;
  apiKey: string;
}

export const aiGenerateTask = task({
  id: "ai-generate",
  run: async (payload: AIGenPayload) => {
    const { prompt, code, apiKey } = payload;

    const sdk = new OpenRouter({
      apiKey: apiKey,
    });

    const messages = [
      {
        role: "system" as const,
        content: SYSTEM_PROMPT
      },
      {
        role: "user" as const,
        content: `Current Code:\n${code}\n\nUser Request: ${prompt}`
      }
    ];

    try {
      const stream = await sdk.chat.send({
        appTitle: "Minimalist HTML IDE",
        chatRequest: {
          model: "openrouter/free", 
          messages: messages,
          stream: true
        }
      });

      let accumulated = '';
      let hasStartedCode = false;
      
      for await (const chunk of stream) {
        const reasoning = (chunk.choices?.[0]?.delta as any)?.reasoning_content;
        const content = chunk.choices?.[0]?.delta?.content;

        if (reasoning) {
          await streams.append("ai-reasoning", reasoning);
        }

        if (content) {
          if (!hasStartedCode) {
            hasStartedCode = true;
          }
          accumulated += content;
          
          // Publish the chunk to the Trigger.dev stream
          // We use 'ai-output' as the stream key
          await streams.append("ai-output", content);
        }
      }

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

import { task, streams } from "@trigger.dev/sdk/v3";
import { OpenRouter } from '@openrouter/sdk'

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
        content: `
You are a World-Class Frontend Architect specializing in rapid prototyping and high-fidelity web experiences within a single-file HTML playground.

Task:
Your goal is to transform or update the provided HTML/CSS/JS code according to the User Request.

Output Rules:
- Output ONLY raw code. NO markdown code blocks, NO explanations, NO preamble.
- Return a complete, valid, and self-contained HTML document.
- Everything must reside in one file. Use CDNs for external dependencies.

Design & Aesthetics (CRITICAL):
- Prioritize modern, premium aesthetics. Use vibrant colors, sleek typography, and ample whitespace.
- Use Tailwind CSS via the Play CDN (<script src="https://cdn.tailwindcss.com"></script>) as the default styling solution.
- For icons, use Lucide (https://unpkg.com/lucide@latest) or Font Awesome.
- Use Google Fonts (e.g., Inter, Outfit, Roboto) to avoid browser defaults.
- Implement smooth transitions and hover effects to make the UI feel "alive."

Technical Guidelines:
- Write clean, semantic HTML5.
- Prefer Vanilla JavaScript (ES6+) for logic.
- For reactivity, you may use Vue (Global build) or Alpine.js via CDN ONLY if the complexity justifies it.
- Never use placeholder text or broken image links. Use Placehold.co (https://placehold.co/) or Unsplash (https://images.unsplash.com/...) for visuals.
- Ensure the code is responsive and works perfectly on all screen sizes.

Core Philosophy:
- Don't just follow instructions—elevate them. If a user asks for a 'login form', build a stunning, centered, responsive login card with validation and micro-animations.
- "Show, don't tell." The code should be the complete explanation.
      `
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

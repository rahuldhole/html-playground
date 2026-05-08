import { tasks, auth, configure } from "@trigger.dev/sdk/v3"
import { OpenRouter } from '@openrouter/sdk'
import type { aiGenerateTask } from "../../trigger/ai-gen"

export default defineEventHandler(async (event) => {
  const { prompt, code } = await readBody(event)
  const config = useRuntimeConfig()

  if (!config.openRouterKey || config.openRouterKey === '') {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenRouter API key is missing.'
    })
  }

  // Handle Trigger.dev Offloading unless explicitly disabled
  if (!config.disableTriggerDev) {
    try {
      const handle = await tasks.trigger<typeof aiGenerateTask>("ai-generate", {
        prompt,
        code,
        apiKey: config.openRouterKey
      })

      // Generate a temporary public token so the frontend can subscribe to this run via WebSockets
      const publicToken = await auth.createPublicToken({
        scopes: {
          read: {
            runs: [handle.id]
          }
        }
      })

      return {
        runId: handle.id,
        publicToken: publicToken
      }
    } catch (error: any) {
      console.error('Trigger.dev Error:', error.message)
      throw createError({
        statusCode: 500,
        statusMessage: error.message || 'Failed to trigger background task'
      })
    }
  }

  // Standard Streaming Implementation
  const sdk = new OpenRouter({
    apiKey: config.openRouterKey,
  })

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
  ]

  try {
    const stream = await sdk.chat.send({
      appTitle: "Minimalist HTML IDE",
      chatRequest: {
        model: "openrouter/free",
        messages: messages,
        stream: true
      }
    })

    let accumulated = ''
    let sentIndex = 0

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content
            if (content) {
              accumulated += content
              let tempCleaned = accumulated.replace(/```(?:html|css|js|javascript|vue|typescript|ts|jsx|tsx|json)?\n?/gi, '')
              const safeToSendLength = Math.max(0, tempCleaned.length - 25)
              
              if (safeToSendLength > sentIndex) {
                const toSend = tempCleaned.slice(sentIndex, safeToSendLength)
                controller.enqueue(new TextEncoder().encode(toSend))
                sentIndex = safeToSendLength
              }
            }
          }
          
          let finalCleaned = accumulated.replace(/```(?:html|css|js|javascript|vue|typescript|ts|jsx|tsx|json)?\n?/gi, '')
          if (finalCleaned.length > sentIndex) {
            controller.enqueue(new TextEncoder().encode(finalCleaned.slice(sentIndex)))
          }
        } catch (e) {
          console.error("Stream processing error:", e)
        } finally {
          controller.close()
        }
      }
    })

    setResponseHeaders(event, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })

    return sendStream(event, responseStream)
  } catch (error: any) {
    console.error('OpenRouter SDK Error:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to connect to OpenRouter'
    })
  }
})



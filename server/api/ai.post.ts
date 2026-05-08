import { OpenRouter } from '@openrouter/sdk'

export default defineEventHandler(async (event) => {
  const { prompt, code } = await readBody(event)
  const config = useRuntimeConfig()

  if (!config.openRouterKey || config.openRouterKey === '') {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenRouter API key is missing.'
    })
  }

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

    // Create a ReadableStream that extracts only the content delta
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content
            if (content) {
              accumulated += content
              
              // Strip out markdown code block syntax globally
              let tempCleaned = accumulated.replace(/```(?:html|css|js|javascript|vue|typescript|ts|jsx|tsx|json)?\n?/gi, '')
              
              // Hold back 25 characters to prevent sending partial markdown blocks 
              // that might be resolved differently as more chunks arrive.
              const safeToSendLength = Math.max(0, tempCleaned.length - 25)
              
              if (safeToSendLength > sentIndex) {
                const toSend = tempCleaned.slice(sentIndex, safeToSendLength)
                controller.enqueue(new TextEncoder().encode(toSend))
                sentIndex = safeToSendLength
              }
            }
          }
          
          // Stream finished, flush the remaining text
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

    // Set appropriate headers for streaming
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


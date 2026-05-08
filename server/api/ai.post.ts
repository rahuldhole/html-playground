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
      content: "You are an expert frontend developer, a deep thinker. Your task is to update the provided HTML/CSS/JS (use relevant CDNs like tailwind browser cdn or modern reactive js libraries to reduce the size of the code) code based on the user's request. Return ONLY the code. Do not include markdown code blocks (like ```html), explanations, or any other text. Just the raw, functional, updated code."
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

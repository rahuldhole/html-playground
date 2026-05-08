import { tasks, auth, configure } from "@trigger.dev/sdk/v3"
import { OpenRouter } from '@openrouter/sdk'
import { SYSTEM_PROMPT } from '../utils/prompt'
import type { aiGenerateTask } from "../../trigger/ai-gen"

export default defineEventHandler(async (event) => {
  const { prompt, code } = await readBody(event)
  console.log(`[AI Request] Prompt: "${prompt?.slice(0, 50)}..."`)
  const config = useRuntimeConfig()

  // Ensure Trigger.dev is configured if key is available
  if (config.triggerSecretKey) {
    configure({
      secretKey: config.triggerSecretKey
    })
  }

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
      content: [
        {
          type: "text" as const,
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" as const }
        }
      ]
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



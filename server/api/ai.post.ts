import { Client } from '@upstash/qstash'

export default defineEventHandler(async (event) => {
  const { prompt, code } = await readBody(event)
  const config = useRuntimeConfig()
  
  const messages = [
    {
      "role": "system",
      "content": "You are an expert frontend developer, a deep thinker. Your task is to update the provided HTML/CSS/JS (use relevant CDNs to reduce the size of the code) code based on the user's request. Return ONLY the code. Do not include markdown code blocks (like ```html), explanations, or any other text. Just the raw, functional, updated code."
    },
    {
      "role": "user",
      "content": `Current Code:\n${code}\n\nUser Request: ${prompt}`
    }
  ]

  // Normal Direct API Call
  if (!config.aiUseQStash) {
    if (!config.openRouterKey || config.openRouterKey === '') {
      throw createError({
        statusCode: 500,
        statusMessage: 'OpenRouter API key is missing.'
      })
    }

    try {
      const response: any = await $fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.openRouterKey}`,
          "Content-Type": "application/json",
          "X-Title": "Minimalist HTML IDE"
        },
        body: {
          "model": "openrouter/free",
          "messages": messages
        }
      })
      return response
    } catch (error: any) {
      console.error('OpenRouter API Error:', error.data || error.message)
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.data?.error?.message || 'Failed to connect to OpenRouter'
      })
    }
  }

  // QStash Offloading
  if (!config.qstashToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'QStash token is missing.'
    })
  }

  const client = new Client({ 
    token: config.qstashToken,
    baseUrl: config.qstashUrl || undefined
  })

  try {
    const res = await client.publishJSON({
      url: "https://openrouter.ai/api/v1/chat/completions",
      headers: {
        "Authorization": `Bearer ${config.openRouterKey}`,
        "X-Title": "Minimalist HTML IDE"
      },
      body: {
        "model": "google/gemma-4-26b-a4b-it",
        "messages": messages
      }
    })

    return { messageId: res.messageId }
  } catch (error: any) {
    console.error('QStash Error:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to offload AI request to QStash'
    })
  }
})

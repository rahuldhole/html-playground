export default defineEventHandler(async (event) => {
  const { prompt, code } = await readBody(event)
  const config = useRuntimeConfig()
  const apiKey = config.openRouterKey

  if (!apiKey || apiKey === 'your_openrouter_api_key_here' || apiKey === '') {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenRouter API key is missing. Please set NUXT_OPEN_ROUTER_KEY in your .env file.'
    })
  }

  try {
    const response: any = await $fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Title": "Minimalist HTML IDE"
      },
      body: {
        "model": "openrouter/free",
        "messages": [
          {
            "role": "system",
            "content": "You are an expert frontend developer. Your task is to update the provided HTML/CSS/JS code based on the user's request. Return ONLY the code. Do not include markdown code blocks (like ```html), explanations, or any other text. Just the raw, functional, updated code."
          },
          {
            "role": "user",
            "content": `Current Code:\n${code}\n\nUser Request: ${prompt}`
          }
        ]
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
})

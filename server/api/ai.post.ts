export default defineEventHandler(async (event) => {
  const { prompt, code } = await readBody(event)
  const config = useRuntimeConfig()
  
  // Use runtime config if defined in nuxt.config, otherwise fallback to process.env
  const apiKey = config.openRouterKey || process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenRouter API key is not configured in environment variables.'
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
        "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
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

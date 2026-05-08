import { tasks } from "@trigger.dev/sdk/v3"
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

  try {
    // Trigger the background task on Trigger.dev
    const handle = await tasks.trigger<typeof aiGenerateTask>("ai-generate", {
      prompt,
      code,
      apiKey: config.openRouterKey
    })

    // Return the run handle so the frontend can poll for completion
    return {
      runId: handle.id
    }
  } catch (error: any) {
    console.error('Trigger.dev Error:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to trigger background task'
    })
  }
})


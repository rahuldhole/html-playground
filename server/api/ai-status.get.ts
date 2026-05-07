import { Client } from '@upstash/qstash'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const messageId = query.id as string
  const config = useRuntimeConfig()

  if (!messageId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing messageId' })
  }

  try {
    const baseUrl = config.qstashUrl || 'https://qstash.upstash.io'
    
    // Try multiple possible query parameter names for filtering
    const response: any = await $fetch(`${baseUrl}/v2/logs`, {
      headers: {
        'Authorization': `Bearer ${config.qstashToken}`
      },
      query: {
        messageId: messageId,
        messageIds: [messageId] // Try plural array as seen in some docs
      }
    })

    const logs = response.logs || response.events || []
    
    // Find the log for this specific message that was delivered
    const deliveredLog = logs.find((l: any) => 
      l.messageId === messageId && (
        l.state === 'DELIVERED' || 
        l.state === 'SUCCESS' || 
        l.status === 'SUCCESS' ||
        l.responseStatus === 200
      )
    )

    if (deliveredLog) {
      return processLog(deliveredLog)
    }

    // Fallback: Fetch last 20 logs without filter
    const allLogsRes: any = await $fetch(`${baseUrl}/v2/logs`, {
      headers: { 'Authorization': `Bearer ${config.qstashToken}` },
      query: { count: 20 }
    })
    const fallbackLogs = allLogsRes.logs || allLogsRes.events || []
    const fallbackLog = fallbackLogs.find((l: any) => 
      l.messageId === messageId && (
        l.state === 'DELIVERED' || 
        l.state === 'SUCCESS' ||
        l.responseStatus === 200
      )
    )
    
    if (fallbackLog) {
      return processLog(fallbackLog)
    }

    return { status: 'pending' }

  } catch (error: any) {
    console.error('Status Check Error:', error.message)
    return { status: 'error', message: error.message }
  }

  function processLog(log: any) {
    // Check for error states
    if (log.state === 'ERROR' || log.state === 'FAILED' || (log.responseStatus >= 400)) {
      return { status: 'completed', error: log.error || `Request failed with status ${log.responseStatus}` }
    }

    // The response body might be in 'responseBody' or just 'body'
    const body = log.responseBody || log.body
    if (body) {
      try {
        const decodedBody = Buffer.from(body, 'base64').toString()
        return { 
          status: 'completed', 
          data: JSON.parse(decodedBody) 
        }
      } catch (parseError) {
        console.error('Failed to parse response body:', parseError)
        return { status: 'completed', error: 'Failed to parse AI response' }
      }
    }

    return { status: 'pending' }
  }
})

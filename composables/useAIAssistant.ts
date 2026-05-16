import { ref, computed } from 'vue'
import { MODELS, DEFAULT_MODEL, type ModelId } from '~/shared/models'
import { useEditorStore } from '~/stores/editor'

export function useAIAssistant(
  showAIPopup: ReturnType<typeof ref<boolean>>,
  userHasScrolledUp: ReturnType<typeof ref<boolean>>
) {
  const editorStore = useEditorStore()
  
  const aiPrompt = ref('')
  const selectedModel = ref<ModelId>(DEFAULT_MODEL)
  const isAILoading = ref(false)
  const isEditMode = computed(() => !!editorStore.htmlCode)
  const aiStatusText = ref('Thinking...')
  const aiReasoning = ref('')
  const abortController = ref<AbortController | null>(null)
  const currentRunId = ref<string | null>(null)

  const currentModel = computed(() => Object.values(MODELS).find(m => m.id === selectedModel.value) || Object.values(MODELS)[0])
  const modelOptions = Object.values(MODELS).map(m => ({
    id: m.id as ModelId,
    label: m.name,
    description: m.description,
    icon: m.icon
  }))

  const handleCancelAI = async () => {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }

    if (currentRunId.value) {
      try {
        await fetch("/api/ai-cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ runId: currentRunId.value })
        })
      } catch (err) {
        console.error("Failed to cancel background job:", err)
      }
      currentRunId.value = null
    }

    isAILoading.value = false
    aiStatusText.value = 'Thinking...'
  }

  const applyDiffsToCode = (baseCode: string, diffStream: string, onStatus?: (status: string) => void) => {
    if (!diffStream.includes('<<<<<<< SEARCH') && diffStream.length > 50) {
      return diffStream.replace(/```(?:html|css|js|javascript|vue|typescript|ts|jsx|tsx|json)?\n?/gi, '').replace(/```$/g, '');
    }

    const blocks = diffStream.split('<<<<<<< SEARCH');
    let currentCode = baseCode;
    let hasFoundMatch = false;
    
    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i];
      if (block && block.includes('=======')) {
        const parts = block.split('=======');
        const searchPart = parts[0];
        const rest = parts[1];
        
        if (searchPart !== undefined && rest !== undefined) {
          const search = searchPart.replace(/^\n/, '').replace(/\n$/, '');
          
          if (rest.includes('>>>>>>> REPLACE')) {
            const replacement = rest.split('>>>>>>> REPLACE')[0]?.replace(/^\n/, '').replace(/\n$/, '');
            if (replacement !== undefined && currentCode.includes(search)) {
              currentCode = currentCode.replace(search, replacement);
              hasFoundMatch = true;
            }
          } else {
            const partialReplacement = rest.replace(/^\n/, '');
            if (currentCode.includes(search)) {
               currentCode = currentCode.replace(search, partialReplacement);
               hasFoundMatch = true;
            }
          }
        }
      } else if (block && onStatus && !hasFoundMatch) {
         onStatus('Identifying lines to change...');
      }
    }
    return currentCode;
  }

  const handleAISubmit = async () => {
    if (isAILoading.value || !aiPrompt.value) return
    
    if (abortController.value) {
      abortController.value.abort()
    }

    isAILoading.value = true
    aiStatusText.value = 'Thinking...'
    aiReasoning.value = ''
    userHasScrolledUp.value = false
    
    const controller = new AbortController()
    abortController.value = controller
    const signal = controller.signal
    const originalCode = editorStore.htmlCode
    
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal,
        body: JSON.stringify({
          prompt: aiPrompt.value,
          code: editorStore.htmlCode,
          model: selectedModel.value,
          systemPrompt: editorStore.systemPrompt,
          mode: isEditMode.value ? 'edit' : 'full'
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ statusMessage: 'Unknown error' }))
        throw new Error(errorData.statusMessage || `API request failed with status ${response.status}`)
      }

      const contentType = response.headers.get("content-type") || ""
      
      if (contentType.includes("application/json")) {
        const { runId, publicToken } = await response.json()
        currentRunId.value = runId
        
        const { runs, auth, streams } = await import("@trigger.dev/sdk/v3")

        aiStatusText.value = 'Initializing...'

        try {
          let accumulatedCode = ''
          let runCompleted = false
          let finalRunCode: string | null = null
          
          await auth.withAuth({ accessToken: publicToken }, async () => {
            
            const reasoningStreamPromise = (async () => {
              try {
                const stream = await streams.read(runId, "ai-reasoning", { timeoutInSeconds: 600 })
                for await (const chunk of (stream as AsyncIterable<string>)) {
                  if (signal.aborted) break
                  aiReasoning.value += chunk
                }
              } catch (err) {
                console.error("Error reading reasoning stream:", err)
              }
            })()

            const outputStreamPromise = (async () => {
              try {
                const stream = await streams.read(runId, "ai-output", { timeoutInSeconds: 600 })
                let hasStarted = false
                for await (const chunk of (stream as AsyncIterable<string>)) {
                  if (signal.aborted || runCompleted) break
                  
                  if (!hasStarted) {
                    hasStarted = true
                    aiPrompt.value = ''
                  }
                  accumulatedCode += chunk
                  
                  let displayCode = accumulatedCode
                  if (isEditMode.value) {
                    displayCode = applyDiffsToCode(originalCode, accumulatedCode, (s) => {
                      aiStatusText.value = s
                    })
                  } else if (displayCode.includes('```')) {
                    displayCode = displayCode.replace(/```(?:html|css|js|javascript|vue|typescript|ts|jsx|tsx|json)?\n?/gi, '').replace(/```$/g, '')
                  }
                  editorStore.setHtmlCode(displayCode)
                }
              } catch (err) {
                console.error("Error reading output stream:", err)
              }
            })()

            const runSubscriptionPromise = (async () => {
              try {
                for await (const run of runs.subscribeToRun(runId)) {
                  aiStatusText.value = run.status || 'Thinking...'

                  if (run.status === 'COMPLETED') {
                    runCompleted = true
                    
                    const code = (run.output as any)?.code
                    if (code) {
                      finalRunCode = code
                    }
                    
                    isAILoading.value = false
                    aiStatusText.value = 'Ready'
                    
                    controller.abort()
                    break 
                  } else if (['FAILED', 'CANCELED', 'CRASHED', 'SYSTEM_FAILURE', 'EXPIRED', 'TIMED_OUT'].includes(run.status)) {
                    isAILoading.value = false
                    controller.abort()
                    const errorDetails = (run as any).error?.message || (run as any).error || (run as any).output?.error;
                    throw new Error(errorDetails ? `Task failed: ${errorDetails}` : `Task failed with status: ${run.status}`)
                  }
                  
                  if (signal.aborted) break
                }
              } catch (err) {
                console.error("Error in run subscription:", err)
                controller.abort()
                throw err
              }
            })()

            const results = await Promise.allSettled([
              reasoningStreamPromise,
              outputStreamPromise,
              runSubscriptionPromise
            ])

            const failed = results.find(r => r.status === 'rejected') as PromiseRejectedResult | undefined
            if (failed) {
              throw failed.reason
            }
            
            if (finalRunCode) {
              editorStore.setHtmlCode(finalRunCode)
            } else if (runCompleted && accumulatedCode) {
              let displayCode = accumulatedCode
              if (isEditMode.value) {
                displayCode = applyDiffsToCode(originalCode, accumulatedCode)
              } else if (displayCode.includes('```')) {
                displayCode = displayCode.replace(/```(?:html|css|js|javascript|vue|typescript|ts|jsx|tsx|json)?\n?/gi, '').replace(/```$/g, '')
              }
              editorStore.setHtmlCode(displayCode)
            }
          });
        } catch (err: any) {
          if (err.message?.includes('429') || err.message?.toLowerCase().includes('rate-limited')) {
            alert(`Rate Limited: The selected model is temporarily unavailable. Please try again in a few seconds or switch to a different model.`)
          } else {
            alert(`AI Error: ${err.message}`)
          }
        } finally {
          isAILoading.value = false
          aiStatusText.value = 'Thinking...'
          currentRunId.value = null
        }
      } else {
        const reader = response.body?.getReader()
        if (!reader) throw new Error('Response body is null')

        let accumulatedCode = ''
        const decoder = new TextDecoder()
        
        aiStatusText.value = 'Generating...'

        try {
          let hasStarted = false
          while (true) {
            const { done, value } = await reader.read()
            if (done || signal.aborted) break
            
            if (!hasStarted) {
              hasStarted = true
              aiPrompt.value = ''
            }

            const chunk = decoder.decode(value, { stream: true })
            accumulatedCode += chunk
            
            let displayCode = accumulatedCode
            if (isEditMode.value) {
              displayCode = applyDiffsToCode(originalCode, accumulatedCode, (s) => {
                aiStatusText.value = s
              })
            } else if (displayCode.startsWith('```')) {
                displayCode = displayCode.replace(/^```[a-z]*\n/i, '').replace(/\n```$/m, '')
            }
            editorStore.setHtmlCode(displayCode)
          }
        } finally {
          reader.releaseLock()
        }
      }

      isAILoading.value = false
      aiStatusText.value = 'Thinking...'
      abortController.value = null
      currentRunId.value = null
    } catch (error: any) {
      if (error.name === 'AbortError') return
      console.error('AI Error:', error)
      const msg = (error.message?.includes('429') || error.message?.toLowerCase().includes('rate-limited'))
        ? "Rate Limited: This model is busy. Try again soon or switch models."
        : (error.message || 'Failed to connect to AI')
      alert(`Error: ${msg}`)
      isAILoading.value = false
      aiStatusText.value = 'Thinking...'
      currentRunId.value = null
    }
  }

  return {
    aiPrompt,
    selectedModel,
    isAILoading,
    isEditMode,
    aiStatusText,
    aiReasoning,
    currentModel,
    modelOptions,
    handleAISubmit,
    handleCancelAI
  }
}

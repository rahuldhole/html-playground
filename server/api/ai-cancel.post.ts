import { runs, configure } from "@trigger.dev/sdk/v3";

export default defineEventHandler(async (event) => {
  const { runId } = await readBody(event);
  const config = useRuntimeConfig();

  if (!runId) {
    throw createError({
      statusCode: 400,
      statusMessage: "runId is required",
    });
  }

  // Ensure Trigger.dev is configured if key is available
  if (config.triggerSecretKey) {
    configure({
      secretKey: config.triggerSecretKey
    });
  }

  try {
    await runs.cancel(runId);
    return {
      success: true
    };
  } catch (error: any) {
    console.error("Error cancelling run:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to cancel run",
    });
  }
});

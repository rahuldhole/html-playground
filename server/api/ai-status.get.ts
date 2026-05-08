import { runs } from "@trigger.dev/sdk/v3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const runId = query.runId as string;

  if (!runId) {
    throw createError({
      statusCode: 400,
      statusMessage: "runId is required",
    });
  }

  try {
    const run = await runs.retrieve(runId);
    
    // Trigger.dev v3 Statuses: 
    // "PENDING_VERSION" | "QUEUED" | "DEQUEUED" | "EXECUTING" | "WAITING" | 
    // "COMPLETED" | "CANCELED" | "CRASHED" | "FAILED" | "SYSTEM_FAILURE" | 
    // "DELAYED" | "EXPIRED" | "TIMED_OUT"

    if (run.status === "COMPLETED") {
      return {
        status: "COMPLETED",
        output: run.output as { code: string } | null,
      };
    }

    const failureStatuses = ["FAILED", "CANCELED", "CRASHED", "SYSTEM_FAILURE", "EXPIRED", "TIMED_OUT"];
    
    if (failureStatuses.includes(run.status)) {
      return {
        status: run.status,
        error: "Task failed or was cancelled",
      };
    }

    return {
      status: run.status, // QUEUED, EXECUTING, etc.
    };
  } catch (error: any) {
    console.error("Error retrieving run:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to retrieve run status",
    });
  }
});

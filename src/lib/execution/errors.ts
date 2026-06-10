export class ExecutionError extends Error {
  constructor(
    message: string,
    public code: string = "EXECUTION_ERROR",
    public stepId?: string,
  ) {
    super(message);
    this.name = "ExecutionError";
  }
}

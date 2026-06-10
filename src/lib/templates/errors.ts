export class TemplateError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "TemplateError";
    this.statusCode = statusCode;
  }
}

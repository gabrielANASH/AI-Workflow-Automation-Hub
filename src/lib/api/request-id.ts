const REQUEST_ID_HEADER = "x-request-id";

export function generateRequestId(): string {
  return crypto.randomUUID();
}

export function getRequestIdHeader(): string {
  return REQUEST_ID_HEADER;
}

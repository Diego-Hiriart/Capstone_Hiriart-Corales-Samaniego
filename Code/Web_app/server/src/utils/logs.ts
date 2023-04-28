export function serverLog(message: string) {
  console.log(`[SERVER]: ${message}`);
}

export function debugLog(message: string) {
  console.log(`[DEBUG]: ${message}`);
}

export function errorLog(error: string | unknown) {
  if (typeof error === "string") {
    console.log(`[ERROR]: ${error}`);
  } else if (error instanceof Error) {
    console.log(`[ERROR]: ${error.message}`);
  } else {
    console.log(`[ERROR]: Unexpected error ${error}`);
  }
}

export function warnLog(message: string) {
  console.log(`[WARN]: ${message}`);
}

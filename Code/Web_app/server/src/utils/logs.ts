export function serverLog(message: string) {
  console.log(`[SERVER]: ${message}`);
}

export function debugLog(message: string) {
  console.log(`[DEBUG]: ${message}`);
}

export function errorLog(message: string) {
  console.log(`[ERROR]: ${message}`);
}

export function warnLog(message: string) {
  console.log(`[WARN]: ${message}`);
}

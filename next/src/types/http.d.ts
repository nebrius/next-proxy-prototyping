declare module 'http' {
  interface IncomingMessage {
    bootstrap?: Record<string, unknown>
  }
}
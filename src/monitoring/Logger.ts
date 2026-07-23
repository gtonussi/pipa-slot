export const DEBUG = true;

type LogContext =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean;

/**
 * Lightweight logger utility used across runtime flows.
 * Toggle all logs by flipping the DEBUG flag above.
 */
export class Logger {
  constructor(private readonly category: string) {}

  info(message: string, context?: LogContext): void {
    if (!DEBUG) return;
    this.write("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    if (!DEBUG) return;
    this.write("warn", message, context);
  }

  error(message: string, context?: LogContext): void {
    if (!DEBUG) return;
    this.write("error", message, context);
  }

  private write(
    level: "info" | "warn" | "error",
    message: string,
    context?: LogContext,
  ): void {
    const formatted = this.formatMessage(message);
    if (context === undefined) {
      console[level](formatted);
      return;
    }
    console[level](formatted, context);
  }

  private formatMessage(message: string): string {
    return `[${new Date().toISOString()}] [${this.category}] ${message}`;
  }
}

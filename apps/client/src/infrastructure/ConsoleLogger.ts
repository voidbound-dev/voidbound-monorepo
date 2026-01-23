import { ILogger } from '@voidbound/domain';

/**
 * Реализация логгера, выводящая сообщения в консоль браузера.
 */
export class ConsoleLogger implements ILogger {
  private readonly prefix = '[Voidbound]';

  debug(message: string, ...args: unknown[]): void {
    console.debug(`${this.prefix} ${message}`, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    console.info(`${this.prefix} ${message}`, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`${this.prefix} ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(`${this.prefix} ${message}`, ...args);
  }
}

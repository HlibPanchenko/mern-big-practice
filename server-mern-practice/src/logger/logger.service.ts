import { Logger, ILogObj } from "tslog";

export class MyLogger {
  private logger: Logger<ILogObj>;

  constructor() {
    this.logger = new Logger();
  }

  public logDebug(message: string): void {
    this.logger.debug(message);
  }

  public log(message: string): void {
    this.logger.info(message);
  }

  public logError(...args: unknown[]): void {
    this.logger.error(...args);
  }
}

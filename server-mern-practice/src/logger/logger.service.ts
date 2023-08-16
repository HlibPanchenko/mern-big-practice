import { injectable } from "inversify";
import { Logger, ILogObj } from "tslog";
import { IMyLogger } from "./logger.interface";

@injectable()
export class MyLogger implements IMyLogger {
  public logger: Logger<ILogObj>;

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

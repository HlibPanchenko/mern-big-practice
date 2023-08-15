import { Logger, ILogObj } from "tslog";

export interface IMyLogger {
  logger: Logger<ILogObj>;

  logDebug: (message: string) => void;
  log: (message: string) => void;
  logError: (...args: unknown[]) => void;
}

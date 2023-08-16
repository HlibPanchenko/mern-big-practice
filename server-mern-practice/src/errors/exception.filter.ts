import { NextFunction, Request, Response } from "express";
import { MyLogger } from "../logger/logger.service.js";
import { IExceptionFilter } from "./exception.filter.interface.js";
import { HTTPError } from "./http-error.class.js";
import { inject, injectable } from "inversify";
import { IMyLogger } from "../logger/logger.interface.js";
import { TYPES } from "../utils/types.js";
import "reflect-metadata";

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  // (TYPES.IMyLogger) - ключ; logger - переменная; IMyLogger - контракт
  // @inject(TYPES.IMyLogger) private logger: IMyLogger - сюда попадет инстанс класса MyLogger
  constructor(@inject(TYPES.IMyLogger) private logger: IMyLogger) {}

  catch(
    err: Error | HTTPError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (err instanceof HTTPError) {
      this.logger.logError(
        ` [${err.context}] Ошибка ${err.statusCode} : ${err.message}`
      );
      res.status(err.statusCode).send({ err: err.message });
    } else {
      this.logger.logError(`${err.message}`);
      res.status(500).send({ err: err.message });
    }
  }
}

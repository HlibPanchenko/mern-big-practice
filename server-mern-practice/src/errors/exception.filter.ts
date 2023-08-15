import { NextFunction, Request, Response } from "express";
import { MyLogger } from "../logger/logger.service.js";
import { IExceptionFilter } from "./exception.filter.interface.js";
import { HTTPError } from "./http-error.class.js";

export class ExceptionFilter implements IExceptionFilter {
  logger: MyLogger;
  constructor(logger: MyLogger) {
    this.logger = logger;
  }

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

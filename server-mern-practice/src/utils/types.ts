export const TYPES = {
  Application: Symbol.for("Application"),
  IMyLogger: Symbol.for("IMyLogger"),
  IExceptionFilter: Symbol.for("IExceptionFilter"),
  FileController: Symbol.for("FileController"),
  PostController: Symbol.for("PostController"),
  IUserController: Symbol.for("IUserController"),
  FileService: Symbol.for("FileService"),
  UploadService1: Symbol.for("UploadService1"),
  UploadService2: Symbol.for("UploadService2"),
  PostService: Symbol.for("PostService"),
  UserService: Symbol.for("UserService"),
  MailService: Symbol.for("MailService"),
  TokenService: Symbol.for("TokenService"),
  AuthRouter: Symbol.for("AuthRouter"),
  FileRouter: Symbol.for("FileRouter"),
  PostRouter: Symbol.for("PostRouter"),
  MulterConfig1: Symbol.for("MulterConfig1"),
  MulterConfig2: Symbol.for("MulterConfig2"),
};

/**
 * InversifyJS, как и многие другие библиотеки IoC контейнеров,
 * использует идентификаторы (или "ключи") для связывания зависимостей
 * с конкретными классами или объектами.
 *
 * Здесь вы определяете объект TYPES, который содержит символы в качестве
 * идентификаторов для различных типов зависимостей.
 * Эти символы представляют собой уникальные ключи, по
 * которым InversifyJS будет искать и внедрять зависимости.
 * 
 * Можем делать связь либо через интерфейсы (IMyLogger, IExceptionFilter),
 * либо через классы (FileController и тд). Лучше потом сделать все через интерфейсы  
 */

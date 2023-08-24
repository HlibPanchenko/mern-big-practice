import "reflect-metadata";
import { Container, ContainerModule, interfaces } from "inversify";

import { App } from "./app.js";
import { FileController } from "./controllers/FileController.js";
import { PostController } from "./controllers/PostController.js";
import { UserController } from "./controllers/UserController.js";
import { MyLogger } from "./logger/logger.service.js";
import { AuthRouter } from "./routes/auth.routes.js";
import { FileRouter } from "./routes/file.routes.js";
import { PostRouter } from "./routes/post.routes.js";
import { FileService } from "./services/File.service.js";
import { UploadService } from "./services/multer.service.js";
import { MulterConfig, MulterConfigs } from "./utils/multerConfig.js";
import { UserService } from "./services/User.service.js";
import { PostService } from "./services/Post.service.js";
import { ExceptionFilter } from "./errors/exception.filter.js";
import { IMyLogger } from "./logger/logger.interface.js";
import { TYPES } from "./utils/types.js";
import { IExceptionFilter } from "./errors/exception.filter.interface.js";
import { IUserController } from "./controllers/UserController.interface.js";
import { MailService } from "./services/MailService.js";
import { TokenService } from "./services/Token.service..js";

// oop
// async function initApp() {
//   const fileService = new FileService();
//   const logger = new MyLogger();
//   const multerService = new UploadService(MulterConfigs.config1); // передайте объект конфигурации в конструктор
//   const multerService2 = new UploadService(MulterConfigs.config2);
//   const userController = new UserController(new UserService());
//   const fileController = new FileController(fileService);
//   const postController = new PostController(new PostService());
//   const authRouter = new AuthRouter(userController);
//   const fileRouter = new FileRouter(fileController, multerService);
//   const postRouter = new PostRouter(postController, multerService2);
//   const app = new App(
//     logger,
//     authRouter,
//     fileRouter,
//     postRouter,
//     new ExceptionFilter(logger)
//   );
//   await app.start();
// }

// initApp();

// Создайте контейнер IoC
const appContainer = new Container();
// Регистрируйте зависимости в контейнере
// в generic указываем какой интерфейс будем биндить (можно и реализацию интерфейса - т.е. класс)
// to(MyLogger) - конкретная реализация интерфейса
// после generic в () пишем символ связи
// можем использовать ContainerModule из InversifyJS для создания модулей, которые объединяют биндинги для определенных функциональных блоков
const multerConfigModule = new ContainerModule((bind: interfaces.Bind) => {
  /**
 * нижние 4 абзаца это реализация этого:
 * const multerService = new UploadService(MulterConfigs.config1); // передайте объект конфигурации в конструктор
//   const multerService2 = new UploadService(MulterConfigs.config2);
 const fileRouter = new FileRouter(fileController, multerService);
//   const postRouter = new PostRouter(postController, multerService2);

Мы это реализовали с помощью Конструктора с параметрами
Давайте разберемся, как это работает:

1. MulterConfigs.config1 и MulterConfigs.config2 определяют объекты MulterConfig с 
конфигурациями для разных сценариев загрузки файлов.

2. Вы связываете эти объекты MulterConfig с типами TYPES.MulterConfig1 и TYPES.MulterConfig2 
в контейнере с помощью toConstantValue. Это означает, что контейнер будет предоставлять те же самые объекты MulterConfig, когда вы попросите его получить объект с соответствующим типом.

3. Затем вы связываете UploadService с типами TYPES.UploadService1 и TYPES.UploadService2 
в контейнере с помощью toDynamicValue. Это позволяет вам создать экземпляр UploadService с 
зависимостями, которые вы разрешите динамически во время выполнения, используя функцию, 
переданную в toDynamicValue.

4. Функция в toDynamicValue получает объект context, который предоставляет информацию о 
контейнере. Вы используете этот объект, чтобы получить зависимости (объекты MulterConfig) из 
контейнера с помощью метода context.container.get. Затем вы передаете полученный объект MulterConfig в 
конструктор UploadService и возвращаете новый экземпляр UploadService, настроенный с соответствующей конфигурацией.

Таким образом, когда вы запрашиваете из контейнера объект UploadService с типом TYPES.UploadService1 
или TYPES.UploadService2, контейнер будет создавать экземпляр UploadService, используя соответствующий
 объект MulterConfig, который вы предварительно связали в контейнере.
 */
  /**
 связываем UploadService с типами TYPES.UploadService1 и TYPES.UploadService2 в контейнере с помощью 
 toDynamicValue. Это позволяет вам создать экземпляр UploadService с зависимостями, 
 которые вы разрешите динамически во время выполнения, используя функцию, переданную в toDynamicValue. 
 По-сути, то же самое что и .to(UploadService(config))
 *  */
  // в контенйер кладем переменные  MulterConfigs.config1 и MulterConfigs.config2 которые содержат в себе настройки конфигурации для мультера
  appContainer
    .bind<MulterConfig>(TYPES.MulterConfig1)
    .toConstantValue(MulterConfigs.config1);
  appContainer
    .bind<MulterConfig>(TYPES.MulterConfig2)
    .toConstantValue(MulterConfigs.config2);
  // а тут уже достаем из контейнера переменные  MulterConfigs.config1 и MulterConfigs.config2 и передаем в конструктор UploadService
  appContainer
    .bind<UploadService>(TYPES.UploadService1)
    .toDynamicValue((context) => {
      const config = context.container.get<MulterConfig>(TYPES.MulterConfig1);
      return new UploadService(config);
    });

  appContainer
    .bind<UploadService>(TYPES.UploadService2)
    .toDynamicValue((context) => {
      const config = context.container.get<MulterConfig>(TYPES.MulterConfig2);
      return new UploadService(config);
    });
});
const servicesModule = new ContainerModule((bind: interfaces.Bind) => {
  appContainer.bind<IMyLogger>(TYPES.IMyLogger).to(MyLogger).inSingletonScope()
  appContainer
    .bind<IExceptionFilter>(TYPES.IExceptionFilter)
    .to(ExceptionFilter).inSingletonScope();
  appContainer.bind<FileService>(TYPES.FileService).to(FileService);
  appContainer.bind<PostService>(TYPES.PostService).to(PostService);
  appContainer.bind<UserService>(TYPES.UserService).to(UserService);
  appContainer.bind<MailService>(TYPES.MailService).to(MailService);
  appContainer.bind<TokenService>(TYPES.TokenService).to(TokenService);
});

const routesModule = new ContainerModule((bind: interfaces.Bind) => {
  appContainer.bind<AuthRouter>(TYPES.AuthRouter).to(AuthRouter);
  appContainer.bind<FileRouter>(TYPES.FileRouter).to(FileRouter);
  appContainer.bind<PostRouter>(TYPES.PostRouter).to(PostRouter);
});

const controllersModule = new ContainerModule((bind: interfaces.Bind) => {
  appContainer.bind<IUserController>(TYPES.IUserController).to(UserController);
  appContainer.bind<PostController>(TYPES.PostController).to(PostController);
  appContainer.bind<FileController>(TYPES.FileController).to(FileController);
  appContainer.bind<App>(TYPES.Application).to(App);
});

appContainer.load(
  multerConfigModule,
  servicesModule,
  routesModule,
  controllersModule
);
// получим экземпляр класса App чтобы запустить приложение
// раньше мы делали это так:  const app = new App(); await app.start();
// теперь можем получать экземпляр любого класса с контейнера с помощью get
const app = appContainer.get<App>(TYPES.Application);
app.start();

export { app, appContainer };

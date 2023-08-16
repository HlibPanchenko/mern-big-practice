import multer from "multer";
import { IUserIdRequest } from "../utils/req.interface";
import "reflect-metadata";
import { injectable } from "inversify";

type UploadConfig = {
  destination: (
    req: IUserIdRequest,
    file: Express.Multer.File,
    cb: Function
  ) => void;
  filename: (
    req: IUserIdRequest,
    file: Express.Multer.File,
    cb: Function
  ) => void;
  limits?: { fileSize: number };
  fileFilter: (req: any, file: Express.Multer.File, cb: Function) => void;
};

@injectable()
export class UploadService {
  private upload: multer.Multer;

  constructor(config: UploadConfig) {
    //  const storage = multer.diskStorage({
    //    destination: function (req: IUserIdRequest, file, cb) {
    //      const userId = req.userId as string;
    //      const userFolderPath = path.join(config.get("staticPath"), userId);
    //      // Создание папки пользователя, если она не существует
    //      if (!fs.existsSync(userFolderPath)) {
    //        fs.mkdirSync(userFolderPath);
    //      }
    //      // Указываем путь, куда сохранять файл
    //      cb(null, userFolderPath);
    //    },
    //    filename: function (req: IUserIdRequest, file, cb) {
    //      cb(
    //        null,
    //        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    //      );
    //    },
    //  });
    const storage = multer.diskStorage({
      destination: config.destination,
      filename: config.filename,
    });

    this.upload = multer({
      storage: storage,
      limits: config.limits || { fileSize: 1024 * 1024 },
      fileFilter: config.fileFilter,
    });

    //  this.upload = multer({
    //    storage: storage,
    //    limits: { fileSize: 1024 * 1024 },
    //    fileFilter: function (req, file, cb) {
    //      if (file.mimetype.startsWith("image/")) {
    //        cb(null, true);
    //      } else {
    //        cb(new Error("Only images are allowed."));
    //      }
    //    },
    //  });
  }

  public single(fieldName: string): any {
    return this.upload.single(fieldName);
  }

  public array(fieldName: string, quantity: number): any {
    return this.upload.array(fieldName, quantity);
  }
}

import multer from "multer";
import path from "path";
import config  from "config";
import { IUserIdRequest } from "../utils/req.interface";
import fs from "fs";

export class UploadService {
	private upload: multer.Multer;
 
	constructor() {
		const storage = multer.diskStorage({
			destination: function (req: IUserIdRequest, file, cb) {
			  const userId = req.userId as string;
			  const userFolderPath = path.join(config.get("staticPath"), userId);
			  // Создание папки пользователя, если она не существует
			  if (!fs.existsSync(userFolderPath)) {
				 fs.mkdirSync(userFolderPath);
			  }
			  // Указываем путь, куда сохранять файл
			  cb(null, userFolderPath);
			},
			filename: function (req: IUserIdRequest, file, cb) {
			  cb(
				 null,
				 file.fieldname + "-" + Date.now() + path.extname(file.originalname)
			  );
			},
		 });
	
		 this.upload = multer({
			storage: storage,
			limits: { fileSize: 1024 * 1024 },
			fileFilter: function (req, file, cb) {
			  if (file.mimetype.startsWith("image/")) {
				 cb(null, true);
			  } else {
				 cb(new Error("Only images are allowed."));
			  }
			},
		 });
	}
 
	public single(fieldName: string): any {
	  return this.upload.single(fieldName);
	}
 }
 
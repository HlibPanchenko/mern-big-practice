import jwt from "jsonwebtoken";

// Генерация JWT токена
export const generateToken = (userId:any) => {
  const payload = { userId };
  const token = jwt.sign(payload, "secret123", { expiresIn: "1h" });
  return token;
};

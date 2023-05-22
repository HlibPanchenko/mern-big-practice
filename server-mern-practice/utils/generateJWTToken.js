import jwt from "jsonwebtoken";

// Генерация JWT токена
export const generateToken = (userId) => {
  const payload = { userId };
  const token = jwt.sign(payload, "secret123", { expiresIn: "1h" });
  return token;
};

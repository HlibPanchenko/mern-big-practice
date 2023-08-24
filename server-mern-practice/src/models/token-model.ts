import mongoose, { Document } from "mongoose";

export interface IToken extends Document {
  user: mongoose.Types.ObjectId;
  refreshToken: string;
}

const TokenSchema = new mongoose.Schema<IToken>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  refreshToken: { type: String, required: true },
});

export default mongoose.model<IToken>("Token", TokenSchema);

import mongoose, { Document } from "mongoose";

const roleSchema = new mongoose.Schema({
  value: { type: String, unique: true, default: "USER" },
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
// export default mongoose.model("Post", Post);

import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true }, // e.g., 'web'
  name: { type: String, required: true },
  membersLabel: { type: String, default: "0 members" },
  letter: { type: String, required: true },
  color: { type: String, default: "#8B52C3" },
});

export default mongoose.model("Board", boardSchema);
import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  total: Number,
  operational: Number,
  maintenance: Number,
  outOfService: Number,
});

export default mongoose.model("MachineStats", statsSchema);

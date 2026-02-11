import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes.js";
import wardenRoutes from "./routes/wardenRoutes.js";
import messRoutes from "./routes/messRoutes.js";
import laundryRoutes from "./routes/laundryRoutes.js";
import outpassRoutes from "./routes/outpassRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import utilityRoutes from "./routes/utilityRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/student", studentRoutes);
app.use("/api/warden", wardenRoutes);
app.use("/api/mess", messRoutes);
app.use("/api/laundry", laundryRoutes);
app.use("/api/outpass", outpassRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/utilities", utilityRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/complaints", complaintRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));


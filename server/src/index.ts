import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { planRouter } from "../routes/plan";
import { profileRouter } from "../routes/profile";

// Load environment variables
dotenv.config();

// config
const app = express();
const PORT = process.env.PORT;

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//  API Routes
app.use("/api/plan", planRouter);
app.use("/api/profile", profileRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

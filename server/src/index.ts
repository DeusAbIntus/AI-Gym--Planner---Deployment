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
const PORT = process.env.PORT || 3000;

// middlewares
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CORS_ORIGIN
        : "http://localhost:5173",
    credentials: true,
  }),
);
// app.use(cors()); ---> This is the default CORS configuration, which allows all origins. In production, you should specify the allowed origins for better security.
app.use(express.json());
app.use(cookieParser());

//  API Routes
app.use("/api/plan", planRouter);
app.use("/api/profile", profileRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import { extractUserId } from "./middleware/extractUserId.js";

dotenv.config();

global.__dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static("public"));

app.use(bodyParser.json({ limit: "30mb", extended: true }));

const allowedOrigins = [
  "https://crypto-vk.vercel.app/",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new getSystemErrorMap("Not allowed by CORS"));
      }
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/post", extractUserId, postRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => console.log("server on 5000"));
  })
  .catch((err) => console.log(err));

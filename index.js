import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import { extractUserId } from "./middleware/extractUserId.js";

dotenv.config();

const app = express();

app.use(express.static("public"));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(cors());

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

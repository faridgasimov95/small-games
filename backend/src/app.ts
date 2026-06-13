import express from "express";
import cors from "cors";
import wordleRouter from "./routes/wordleRoutes";
import hangmanRouter from "./routes/hangmanRoutes";
import wordsmithRouter from "./routes/wordsmithRoutes";

/**
 * Express App configuration.
 * Middleware setup (CORS, JSON parsing) and base routes.
 */
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Small games API is running");
});

app.use("/wordle", wordleRouter);
app.use("/hangman", hangmanRouter);
app.use("/wordsmith", wordsmithRouter);

export default app;

import express from "express";
import wordleRouter from "./routes/wordleRoutes";
import hangmanRouter from "./routes/hangmanRoutes";

/**
 * Express App configuration.
 * Middleware setup (CORS, JSON parsing) and base routes.
 */
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Small games API is running");
});

app.use("/wordle", wordleRouter);
app.use("/hangman", hangmanRouter);

export default app;

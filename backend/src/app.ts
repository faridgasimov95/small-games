import express from "express";
import wordleRouter from "./routes/wordleRoutes";

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

export default app;

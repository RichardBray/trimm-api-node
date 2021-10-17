import express from "express";
import { PORT } from "./config";
import pino from "pino";

const app = express();
const logger = pino();
app.use(express.json()); // Parse response payload to json

app.get("/test", (req, res) => {
  debugger;
  res.status(200).send("Hello 41122");
});

if (process.env.NODE_ENV === "production") {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

export const viteNodeApp = app;

import express from "express";
import logger from "./utils/logger";

import { PORT } from "./config";

const app = express();

app.use(express.json()); // Parse response payload to json

app.get("/test", (req, res) => {
  logger.info("testing");
  res.status(200).send("Hello 41122");
});

if (process.env.NODE_ENV === "production") {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

export const viteNodeApp = app;

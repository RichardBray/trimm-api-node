import express from "express";
import logger from "./utils/logger.js";

import { PORT } from "./config/index.js";

const app = express();

app.use(express.json());

app.get("/test", (req, res) => {
  logger.warn("testing");
  res.status(200).send("Hello 42211");
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

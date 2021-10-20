import express from "express";
import { graphqlHTTP } from "express-graphql";

import logger from "./utils/logger.js";
import * as config from "./config.js";

import authRouter from "./components/Auth/AuthRouter.js";
import itemsSchema from "./components/Items/ItemsSchema.js";

const app = express();

app.use(authRouter);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: itemsSchema,
    graphiql: true,
  })
);

app.listen(config.port, () => {
  logger.info(`🚀 Server running on port ${config.port}`);
});

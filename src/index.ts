import express from "express";
import { graphqlHTTP } from "express-graphql";

import logger from "./helpers/logger.js";
import * as config from "./config.js";

import authRouter from "./components/Auth/AuthRouter.js";
import itemsSchema from "./components/Items/ItemsSchema.js";
import { context } from "./helpers/graphqlContext.js";

const app = express();

app.use(authRouter);
app.use(
  "/graphql",
  graphqlHTTP((request) => ({
    schema: itemsSchema,
    graphiql: true,
    rootValue: request,
    context,
    pretty: true,
  }))
);

app.listen(config.port, () => {
  logger.info(`🚀 Server running on port ${config.port}`);
});

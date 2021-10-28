import express from "express";
import { graphqlHTTP } from "express-graphql";
import { mergeSchemas } from "@graphql-tools/schema";

import logger from "./helpers/logger.js";
import * as config from "./config.js";

import authRouter from "./components/Auth/AuthRouter.js";
import ItemsSchema from "./components/Items/ItemsSchema.js";
import CategoriesSchema from "./components/Categories/CategoriesSchema.js";
import { context } from "./helpers/graphqlContext.js";

const app = express();

app.use(authRouter);

const mergedSchema = mergeSchemas({
  schemas: [ItemsSchema, CategoriesSchema],
});

app.use(
  "/graphql",
  graphqlHTTP((request) => ({
    schema: mergedSchema,
    graphiql: true,
    rootValue: request,
    context,
    pretty: true,
  }))
);

app.listen(config.port, () => {
  logger.info(`🚀 Server running on port ${config.port}`);
});

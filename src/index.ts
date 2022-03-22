import express from "express";
import { graphqlHTTP } from "express-graphql";
import { mergeSchemas } from "@graphql-tools/schema";
import helmet from "helmet";

import logger from "./helpers/logger.js";
import * as config from "./config.js";

import authRouter from "./components/Auth/AuthRouter.js";
import ItemsSchema from "./components/Items/ItemsSchema.js";
import CategoriesSchema from "./components/Categories/CategoriesSchema.js";
import UserSchema from "./components/User/UserSchema.js";
import { context } from "./helpers/graphqlContext.js";

const app = express();
const v1 = express.Router();

v1.use(authRouter);

const mergedSchema = mergeSchemas({
  schemas: [ItemsSchema, CategoriesSchema, UserSchema],
});

v1.use(
  "/graphql",
  graphqlHTTP((request) => ({
    schema: mergedSchema,
    graphiql: !config.isProd,
    rootValue: request,
    context,
  }))
);

if (config.isProd) {
  app.use(helmet());
}

app.use("/v1", v1);
app.use("/", v1);

app
  .listen(config.port, () => {
    logger.info(`🚀 Server running on port ${config.port}`);
  })
  .on("error", (err) => {
    logger.error(err);
  });

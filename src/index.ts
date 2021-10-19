import express from "express";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";

import logger from "./utils/logger.js";
import * as config from "./config.js";

import authRouter from "./components/Auth/AuthRouter.js";

const app = express();

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const rootValue = {
  hello: () => {
    return "Hello world!";
  },
};

app.use(authRouter);

app.use(
  "/test",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

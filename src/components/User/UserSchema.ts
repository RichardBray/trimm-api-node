import { makeExecutableSchema } from "@graphql-tools/schema";
import UserResolver from "./UserResolver.js";

const typeDefs = `#graphql
  type Mutation {
      updateCurrency(currency: String!): User
  }

  type Query {
    getUser: User
  }

  type User {
    user_uuid: ID!
    user_name: String!
    user_email: String!
    user_currency: String!
  }
`;

const { getUserData, updateCurrency } = UserResolver;

const resolvers = {
  Mutation: {
    updateCurrency,
  },
  Query: {
    getUser: getUserData,
  },
};

const UserSchema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

export default UserSchema;

import { makeExecutableSchema } from "@graphql-tools/schema";
import CategoriesResolver from "./CategoriesResolver.js";

const typeDefs = `#graphql
  type Mutation {
    createCategory(ame: String!): Category
    deleteCategory(id: String!): Boolean!
  }

  type Query {
    categories: [Category]
  }

  type Category {
    cat_uuid: String!
    cat_name: String!
    user_uuid: String!
  }
`;

const { getAllCategories } = CategoriesResolver;

const resolvers = {
  Query: {
    categories: getAllCategories,
  },
};

const CategoriesSchema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

export default CategoriesSchema;

import { makeExecutableSchema } from "@graphql-tools/schema";
import CategoriesResolver from "./CategoriesResolver.js";

const typeDefs = `#graphql
  type Mutation {
    createCategory(name: String!): Category
    deleteCategory(cat_uuid: String!): Category
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

const { getAllCategories, createCategory, deleteCategory } = CategoriesResolver;

const resolvers = {
  Mutation: {
    createCategory,
    deleteCategory,
  },
  Query: {
    categories: getAllCategories,
  },
};

const CategoriesSchema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

export default CategoriesSchema;

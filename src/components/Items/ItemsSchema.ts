import { makeExecutableSchema } from "@graphql-tools/schema";
import { DateTimeResolver } from "graphql-scalars";
import ItemResolvers from "./ItemResolvers.js";

const typeDefs = `#graphql
  type Mutation {
    createItem(itemCreateInput: ItemCreateInput!): Item
    deleteItem(id: Int!): Boolean!
  }

  type Query {
    items(start_date: String!, end_date: String!): [Item]
  }

  type Item {
    item_uuid: ID!
    item_name: String!
    item_price: Int!
    create_dttm: DateTime
    user_id: ID!
    cat_id: Int!
  }

  input ItemCreateInput {
    item_name: String!
    item_price: Int!
    create_dttm: DateTime!
    cat_id: Int!
  }

  scalar DateTime
`;

const { getAllItems } = ItemResolvers;

const resolvers = {
  Query: {
    items: getAllItems,
  },
  DateTime: DateTimeResolver,
};

const ItemsSchema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

export default ItemsSchema;

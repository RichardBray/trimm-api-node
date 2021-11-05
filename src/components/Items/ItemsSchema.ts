import { makeExecutableSchema } from "@graphql-tools/schema";
import { DateTimeResolver } from "graphql-scalars";
import ItemResolver from "./ItemResolver.js";

const typeDefs = `#graphql
  type Mutation {
    createItem(itemCreateInput: ItemCreateInput!): Item
    deleteItem(item_uuid: String!): Item
  }

  type Query {
    items(startDate: String!, endDate: String!): [Item]
  }

  type Item {
    item_uuid: ID!
    item_name: String!
    item_price: Int!
    create_dttm: DateTime
    user_id: ID!
    cat_uuid: String!
  }

  input ItemCreateInput {
    name: String!
    price: Int!
    createDttm: DateTime!
    catUuid: String!
  }

  scalar DateTime
`;

const { getAllItems, createItem, deleteItem } = ItemResolver;

const resolvers = {
  Mutation: {
    createItem,
    deleteItem,
  },
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

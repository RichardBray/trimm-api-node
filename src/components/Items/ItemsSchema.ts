import { makeExecutableSchema } from "@graphql-tools/schema";
import { DateTimeResolver } from "graphql-scalars";
import ItemResolver from "./ItemResolver.js";

const typeDefs = `#graphql
  type Mutation {
    createItem(itemCreateInput: ItemCreateInput!): Item
    deleteItem(item_uuid: String!): Item
    updateItem(itemUpdateInput: ItemUpdateInput): Item
  }

  type Query {
    items(startDate: String!, endDate: String!): [Item]
  }

  type Item {
    item_uuid: ID!
    item_name: String!
    item_price: Float!
    create_dttm: DateTime
    user_id: ID!
    cat_uuid: String!
  }

  input ItemCreateInput {
    name: String!
    price: Float!
    createDttm: DateTime!
    catUuid: String!
  }

  input ItemUpdateInput {
    uuid: String!
    name: String,
    price: Float
  }

  scalar DateTime
`;

const { getAllItems, createItem, deleteItem, updateItem } = ItemResolver;

const resolvers = {
  Mutation: {
    createItem,
    deleteItem,
    updateItem,
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

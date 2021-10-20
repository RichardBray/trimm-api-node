import { makeExecutableSchema } from "@graphql-tools/schema";
import { DateTimeResolver } from "graphql-scalars";
import ItemResolvers from "./ItemResolvers.js";

const typeDefs = `#graphql
  type Mutation {
    createItem(itemCreateInput: ItemCreateInput!): Item
    deleteItem(id: Int!): Boolean!
  }

  type Query {
    returnAllItems: [Item]
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

const { returnAllItems } = ItemResolvers;

const resolvers = {
  Query: {
    returnAllItems,
  },
  DateTime: DateTimeResolver,
};

const ItemsSchema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

export default ItemsSchema;

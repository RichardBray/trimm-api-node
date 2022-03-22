/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { spending } from "@prisma/client/index.js";

import generateUuid from "../../helpers/uuid.js";
import logger from "../../helpers/logger.js";
import AuthController from "../Auth/AuthController.js";
import { Context } from "../../helpers/graphqlContext.js";

type ItemCreateInput = {
  itemCreateInput: {
    name: string;
    price: number;
    createDttm: string;
    catUuid: string;
  };
};

type ItemUpdateInput = {
  itemUpdateInput: {
    uuid: string;
    name?: string;
    price?: number;
  };
};
class ItemResolver {
  static getAllItems(
    req: Request,
    args: { startDate: string; endDate: string },
    context: Context
  ): Promise<spending[]> | unknown {
    try {
      const userData: JwtPayload = AuthController.verifyAccessToken(req);

      if (!userData) {
        throw new Error("Authorisation needed");
      }

      const greaterThanOrEqual = new Date(args.startDate).toISOString();
      const lessThanOrEqual = new Date(args.endDate).toISOString();

      return context.prisma.spending.findMany({
        where: {
          create_dttm: {
            gte: greaterThanOrEqual,
            lte: lessThanOrEqual,
          },
          user_uuid: userData.username,
        },
      });
    } catch (err: unknown) {
      logger.error(`getAllItems Error: ${err}`);
      return err;
    }
  }

  static createItem(req: Request, args: ItemCreateInput, context: Context) {
    try {
      const userData: JwtPayload = AuthController.verifyAccessToken(req);
      const { name, price, createDttm, catUuid } = args.itemCreateInput;

      return context.prisma.spending.create({
        data: {
          item_uuid: generateUuid(true),
          item_name: name,
          item_price: price,
          create_dttm: createDttm,
          user_uuid: userData.username,
          cat_uuid: catUuid,
        },
      });
    } catch (err) {
      logger.error(`createItem Error: ${err}`);
      return err;
    }
  }

  static async deleteItem(
    req: Request,
    args: { item_uuid: string },
    context: Context
  ) {
    try {
      const userData: JwtPayload = AuthController.verifyAccessToken(req);
      if (!userData) {
        throw new Error("Authorisation needed");
      }

      const dbSpendingItems = await ItemResolver.#getSpendingItemsForThisUser(
        userData.username,
        context
      );
      const itemDatabaseId = ItemResolver.#getDBIdFromUuid(
        dbSpendingItems,
        args.item_uuid
      );

      return context.prisma.spending.delete({
        where: {
          id: itemDatabaseId,
        },
      });
    } catch (err) {
      logger.error(`deleteItem Error: ${err}`);
      return err;
    }
  }

  static #getDBIdFromUuid(
    dbSpendingItems: spending[],
    itemUuid: string
  ): string {
    let databaseId = "";

    for (const dbSpendingItem of dbSpendingItems) {
      if (dbSpendingItem.item_uuid === itemUuid) {
        databaseId = dbSpendingItem.id;
      }
    }
    return databaseId;
  }

  static async #getSpendingItemsForThisUser(
    userId: string,
    context: Context
  ): Promise<spending[]> {
    return await context.prisma.spending.findMany({
      where: {
        user_uuid: userId,
      },
    });
  }

  static async updateItem(
    req: Request,
    args: ItemUpdateInput,
    context: Context
  ) {
    try {
      const userData: JwtPayload = AuthController.verifyAccessToken(req);
      if (!userData) {
        throw new Error("Authorisation needed");
      }

      const { uuid } = args.itemUpdateInput;
      const dbSpendingItems = await ItemResolver.#getSpendingItemsForThisUser(
        userData.username,
        context
      );
      const itemDatabaseId = ItemResolver.#getDBIdFromUuid(
        dbSpendingItems,
        uuid
      );

      return context.prisma.spending.update({
        where: {
          id: itemDatabaseId,
        },
        data: ItemResolver.#getDataToUpdate(args),
      });
    } catch (err) {
      logger.error(`updateItem Error: ${err}`);
      return err;
    }
  }

  static #getDataToUpdate(args: ItemUpdateInput) {
    const { name, price } = args.itemUpdateInput;
    const dataToUpdate: {
      item_name?: string;
      item_price?: number;
    } = {};

    if (name) {
      dataToUpdate["item_name"] = name;
    }
    if (price) {
      dataToUpdate["item_price"] = price;
    }

    return dataToUpdate;
  }
}

export default ItemResolver;

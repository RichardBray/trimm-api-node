/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prismaPkg, { spending } from "@prisma/client/index.js";

import generateUuid from "../../helpers/uuid.js";
import logger from "../../helpers/logger.js";
import AuthController from "../Auth/AuthController.js";
import { Context } from "../../helpers/graphqlContext.js";

const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

type ItemCreateInput = {
  name: string;
  price: number;
  createDttm: string;
  catId: string;
};
class ItemResolver {
  static getAllItems(
    req: Request,
    args: { startDate: string; endDate: string },
    context: Context
  ): Promise<spending[]> | unknown {
    try {
      const userData: JwtPayload = AuthController.verifyAccessToken(req);

      return context.prisma.spending.findMany({
        where: {
          create_dttm: {
            gte: new Date(args.startDate),
            lte: new Date(args.endDate),
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
      return context.prisma.spending.create({
        data: {
          item_uuid: generateUuid(true),
          item_name: args.name,
          item_price: args.price,
          create_dttm: args.createDttm,
          user_uuid: userData.username,
          cat_uuid: args.catId,
        },
      });
    } catch (err) {
      logger.error(`createItem Error: ${err}`);
      return err;
    }
  }

  static async #getExistingItem(userId: string): Promise<prismaPkg.spending[]> {
    return await prisma.spending.findMany({
      where: {
        user_uuid: userId,
      },
    });
  }

  static async deleteItem(
    req: Request,
    args: { item_uuid: string },
    context: Context
  ) {
    try {
      const userData: JwtPayload = AuthController.verifyAccessToken(req);
      if (!userData) {
        throw new Error("Authorisation neede");
      }

      const id = await ItemResolver.#getItemFromId(userData, args);

      return context.prisma.spending.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      logger.error(`deleteItem Error: ${err}`);
      return err;
    }
  }

  static async #getItemFromId(
    userData: JwtPayload,
    args: { item_uuid: string }
  ) {
    let itemId = "";

    const existingItems = await ItemResolver.#getExistingItem(
      userData.username
    );

    for (const existingItem of existingItems) {
      if (existingItem.item_uuid === args.item_uuid) {
        itemId = existingItem.id;
      }
    }
    return itemId;
  }
}

export default ItemResolver;

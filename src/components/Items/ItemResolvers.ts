/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

import logger from "../../helpers/logger.js";
import AuthController from "../Auth/AuthController.js";
import UserResolvers from "../User/UserResolver.js";
import { Context } from "../../helpers/graphqlContext.js";
class ItemResolvers {
  static returnAllItems(
    req: Request,
    args: { start_date: string; end_date: string },
    context: Context
  ) {
    logger.info("Returning all items");

    const userData: JwtPayload = AuthController.verifyAccessToken(req);
    const userId: number = UserResolvers.userIfFromToken(userData);

    return context.prisma.spending.findMany({
      where: {
        create_dttm: {
          gte: args.start_date,
          lte: args.end_date,
        },
        user_id: userId,
      },
    });
  }
}

export default ItemResolvers;

/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

import logger from "../../helpers/logger.js";
import AuthController from "../Auth/AuthController.js";
import { Context } from "../../helpers/graphqlContext.js";
class ItemResolvers {
  static getAllItems(
    req: Request,
    args: { start_date: string; end_date: string },
    context: Context
  ) {
    try {
      const userData: JwtPayload = AuthController.verifyAccessToken(req);

      return context.prisma.spending.findMany({
        where: {
          create_dttm: {
            gte: args.start_date,
            lte: args.end_date,
          },
          user_id: userData.username,
        },
      });
    } catch (err) {
      logger.error(`getAllItems Error: ${err}`);
      return err;
    }
  }
}

export default ItemResolvers;

import { Request } from "express";
import prismaPkg, { Prisma, users } from "@prisma/client/index.js";
import { JwtPayload } from "jsonwebtoken";

import logger from "../../helpers/logger.js";
import { UserRegistrationData } from "../Auth/AuthController.js";
import AuthController from "../Auth/AuthController.js";
import { Context } from "../../helpers/graphqlContext.js";

class UserResolvers {
  static async addDefaultUserSettings(userData: UserRegistrationData) {
    try {
      const { PrismaClient } = prismaPkg;
      const prisma = new PrismaClient();

      const newUserData: Prisma.usersCreateInput = {
        user_uuid: userData.id,
        user_name: userData.name,
        user_email: userData.email,
        user_currency: "£ - Pound Sterling",
      };
      const result = await prisma.users.create({
        data: newUserData,
      });

      return result;
    } catch (err) {
      logger.error(`addDefaultUserSettings Error: ${err}`);
    }
  }

  static getUserData(req: Request, _args: unknown, context: Context) {
    const userData: JwtPayload = AuthController.verifyAccessToken(req);

    return context.prisma.users.findFirst({
      where: {
        user_uuid: userData.username,
      },
    });
  }

  static async updateCurrency(
    req: Request,
    args: { currency: string },
    context: Context
  ) {
    const userData: JwtPayload = AuthController.verifyAccessToken(req);

    const userDBData: users | null = await context.prisma.users.findFirst({
      where: {
        user_uuid: userData.username,
      },
    });

    return context.prisma.users.update({
      where: {
        id: userDBData?.id,
      },
      data: {
        user_currency: args.currency,
      },
    });
  }
}

export default UserResolvers;

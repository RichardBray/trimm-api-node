import prismaPkg, { Prisma } from "@prisma/client/index.js";

import logger from "../../helpers/logger.js";

const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

class UserResolvers {
  // TODO
  static async addDefaultUserSettings(userId: string, userEmail: string) {
    try {
      const newUserData: Prisma.usersCreateInput = {
        user_uuid: userId,
        user_name: "test",
        user_email: userEmail,
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
}

export default UserResolvers;

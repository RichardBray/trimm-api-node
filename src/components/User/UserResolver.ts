import prismaPkg, { Prisma } from "@prisma/client/index.js";

import logger from "../../helpers/logger.js";
import { UserRegistrationData } from "../Auth/AuthController.js";
const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

class UserResolvers {
  // TODO
  static async addDefaultUserSettings(userData: UserRegistrationData) {
    try {
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
}

export default UserResolvers;

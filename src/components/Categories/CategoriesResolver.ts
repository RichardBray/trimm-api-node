import prismaPkg, { Prisma } from "@prisma/client/index.js";

import generateUuid from "../../helpers/uuid.js";
import logger from "../../helpers/logger.js";

const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

class CategoriesResolver {
  static async addDefaultCategories(userId: string) {
    try {
      const defaultCategories = [
        "Transport",
        "Entertainment",
        "Shopping",
        "Bills",
        "Personal care",
      ] as const;

      const dbEntry: Prisma.categoriesCreateManyInput[] = [];

      for (const category of defaultCategories) {
        dbEntry.push({
          cat_name: category,
          cat_uuid: generateUuid(true),
          user_uuid: userId,
        });
      }
      const result = await prisma.categories.createMany({
        data: dbEntry,
      });

      return result;
    } catch (err) {
      logger.error(`addDefaultCategories Error: ${err}`);
    }
  }
}
export default CategoriesResolver;

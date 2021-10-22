import prismaPkg, { Prisma } from "@prisma/client/index.js";
const { PrismaClient } = prismaPkg;
import generateUuid from "../../helpers/uuid.js";

const prisma = new PrismaClient();

class CategoriesResolver {
  static async addDefaultCategories(userId: string) {
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
        cat_uuid: generateUuid(),
        cat_total: 0,
        cat_budget: 0,
        user_id: userId,
      });
    }
    const result = await prisma.categories.createMany({
      data: dbEntry,
    });
  }
}
export default CategoriesResolver;

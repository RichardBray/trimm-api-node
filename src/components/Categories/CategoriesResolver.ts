import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import prismaPkg, { Prisma, categories } from "@prisma/client/index.js";

import generateUuid from "../../helpers/uuid.js";
import AuthController from "../Auth/AuthController.js";
import logger from "../../helpers/logger.js";
import { Context } from "../../helpers/graphqlContext.js";

class CategoriesResolver {
  static async addDefaultCategories(userId: string) {
    try {
      const { PrismaClient } = prismaPkg;
      const prisma = new PrismaClient();

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

  static getAllCategories(req: Request, _args: unknown, context: Context) {
    try {
      const userData: JwtPayload = AuthController.verifyAccessToken(req);

      return context.prisma.categories.findMany({
        where: {
          user_uuid: userData.username,
        },
      });
    } catch (err) {
      logger.error(`getAllCategories Error: ${err}`);
      return err;
    }
  }

  static async createCategory(
    req: Request,
    args: { name: string },
    context: Context
  ) {
    try {
      const userData: JwtPayload = AuthController.verifyAccessToken(req);
      const existingCategories = await CategoriesResolver.#getExistingCategory(
        userData.username,
        context
      );

      for (const existingCategoryName of existingCategories) {
        if (existingCategoryName.cat_name === args.name) {
          throw new Error("Category already exists");
        }
      }

      return context.prisma.categories.create({
        data: {
          cat_name: args.name,
          cat_uuid: generateUuid(true),
          user_uuid: userData.username,
        },
      });
    } catch (err) {
      logger.error(`createCategory Error: ${err}`);
      return err;
    }
  }

  static async #getExistingCategory(
    userId: string,
    context: Context
  ): Promise<prismaPkg.categories[]> {
    return await context.prisma.categories.findMany({
      where: {
        user_uuid: userId,
      },
    });
  }

  static async deleteCategory(
    req: Request,
    args: { cat_uuid: string },
    context: Context
  ) {
    try {
      const userData: JwtPayload = AuthController.verifyAccessToken(req);

      if (!userData) {
        throw new Error("Authorisation neede");
      }

      const existingCategories = await CategoriesResolver.#getExistingCategory(
        userData.username,
        context
      );
      const id = await CategoriesResolver.#getCategoryFromId(
        existingCategories,
        args
      );

      return context.prisma.categories.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      logger.error(`createCategory Error: ${err}`);
      return err;
    }
  }

  static async #getCategoryFromId(
    dbCategories: categories[],
    args: { cat_uuid: string }
  ) {
    let catId = "";

    for (const existingCategoryName of dbCategories) {
      if (existingCategoryName.cat_uuid === args.cat_uuid) {
        catId = existingCategoryName.id;
      }
    }
    return catId;
  }
}
export default CategoriesResolver;

import prismaPkg from "@prisma/client/index.js";
const { PrismaClient } = prismaPkg;

const prisma = new PrismaClient();

export interface Context {
  prisma: prismaPkg.PrismaClient;
}

export const context: Context = {
  prisma,
};

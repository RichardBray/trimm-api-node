import dotenv from "dotenv";

dotenv.config();

// TODO add types
export const port = process.env.PORT || 3000;
export const cognito = JSON.parse(process.env.COGNITO as string);
export const jwtPublicKey = JSON.parse(process.env.JWTPUBLICKEY as string);
export const isProd = process.env.NODE_ENV === "production";

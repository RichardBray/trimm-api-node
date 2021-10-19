import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || 3000;
export const cognito = JSON.parse(process.env.COGNITO as string);

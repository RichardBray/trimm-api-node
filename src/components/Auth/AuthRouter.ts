import express from "express";
import AuthController from "./AuthController.js";
import cors from "cors";
const authRouter = express.Router();

authRouter.use(express.json());

authRouter.use(
  cors({
    origin: "http://localhost:3000",
  })
);

authRouter.post("/login", AuthController.login);
authRouter.post("/register", AuthController.register);
authRouter.post("/verify", AuthController.verifyRegistration);
authRouter.post("/logout", AuthController.logout);

export default authRouter;

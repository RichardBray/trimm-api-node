import express from "express";
import AuthController from "./AuthController.js";

const authRouter = express.Router();

authRouter.use(express.json());

authRouter.post("/login", AuthController.login);
authRouter.post("/register", AuthController.register);
authRouter.post("/verify", AuthController.verifyRegistration);
authRouter.post("/logout", AuthController.logout);

export default authRouter;

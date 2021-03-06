import { Request, Response } from "express";
import "cross-fetch/dist/node-polyfill.js";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import jwkToPem from "jwk-to-pem";
import jwt, { JwtPayload } from "jsonwebtoken";

import * as config from "../../config.js";
import logger from "../../helpers/logger.js";
import CategoriesResolver from "../Categories/CategoriesResolver.js";
import UserResolver from "../User/UserResolver.js";

export type UserRegistrationData = {
  id: string;
  name: string;
  email: string;
};
class AuthController {
  static login(req: Request, res: Response) {
    try {
      const authData = {
        Username: req.body.username,
        Password: req.body.password,
      };
      const authDetails = new AuthenticationDetails(authData);
      const cognitoUser = AuthController.#createCognitoUser(req);

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          const accessToken = result.getAccessToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();

          logger.info("User login successful");

          res.status(200).send({
            accessToken,
            refreshToken,
          });
        },
        onFailure: (err) => {
          logger.error(`authenticateUser Error: ${err}`);
          res.status(401).send(err);
        },
      });
    } catch (err) {
      logger.error(`login Error: ${err}`);
      res.status(400).send(err);
    }
  }

  static #createUserPool(): CognitoUserPool {
    const poolData = {
      UserPoolId: config.cognito.userPoolId as string,
      ClientId: config.cognito.clientId as string,
    } as const;

    return new CognitoUserPool(poolData);
  }

  static #createCognitoUser(req: Request): CognitoUser {
    if (!req.body.username) {
      throw new Error("Username is required");
    }

    const userPool = AuthController.#createUserPool();
    const userData = {
      Username: req.body.username,
      Pool: userPool,
    };

    return new CognitoUser(userData);
  }

  static register(req: Request, res: Response) {
    const userPool = AuthController.#createUserPool();
    const attributeList = [];
    const dataEmail = {
      Name: "email",
      Value: req.body.username,
    };
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    userPool.signUp(
      req.body.username,
      req.body.password,
      attributeList,
      [],
      (err, result) => {
        if (err) {
          logger.error(`register Error: ${err}`);
          res.status(400).send(err);
        } else {
          logger.info(`User registration successful: ${result?.userSub}`);
          const userId = result?.userSub as string;
          const userData: UserRegistrationData = {
            id: userId,
            name: req.body.username,
            email: req.body.username,
          };

          CategoriesResolver.addDefaultCategories(userId);
          UserResolver.addDefaultUserSettings(userData);
          res.status(201).send({
            msg: "SUCCESS",
          });
        }
      }
    );
  }

  static verifyRegistration(req: Request, res: Response) {
    const cognitoUser = AuthController.#createCognitoUser(req);

    cognitoUser.confirmRegistration(
      req.body.verificationCode,
      true,
      (err: Error, result: string) => {
        if (err) {
          logger.error(`confirmRegistration Error: ${err}`);
          res.status(400).send(err);
        } else {
          logger.info(`User verification successful: ${result}`);
          res.status(200).send({
            msg: result,
          });
        }
      }
    );
  }

  static logout(req: Request, res: Response) {
    try {
      const cognitoUser = AuthController.#createCognitoUser(req);

      cognitoUser.signOut();
      logger.info("Logout successful");
    } catch (err) {
      logger.error(`logout Error: ${err}`);
      res.status(400).send(err);
    }
  }

  static verifyAccessToken(req: Request): JwtPayload | Error {
    try {
      if (!req.headers.authorization) {
        throw new Error("No auth header provided");
      }

      const pem = jwkToPem(config.jwtPublicKey);
      const token = req.headers.authorization.split(" ")[1];

      const verify = jwt.verify(token, pem, {
        algorithms: ["RS256"],
      }) as JwtPayload;

      return verify;
    } catch (err) {
      logger.error(err);
      throw new Error(err as string);
    }
  }
}

export default AuthController;

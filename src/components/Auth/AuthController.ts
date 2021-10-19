import { Request, Response } from "express";
import "cross-fetch/dist/node-polyfill.js";
import * as AWS from "aws-sdk/global.js";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

import * as config from "../../config.js";
import logger from "../../utils/logger.js";

class AuthController {
  static login(req: Request, res: Response) {
    try {
      logger.info("Attempting user login");

      if (!req.body.password) {
        throw new Error("Password is required");
      }

      const authData = {
        Username: req.body.username,
        Password: req.body.password,
      };
      const authDetails = new AuthenticationDetails(authData);
      const cognitoUser = AuthController.#createCognitoUser(req);

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          const accessToken = result.getAccessToken().getJwtToken();
          // AuthController.#configureRefreshCredentials(result);
          res.status(200).send({
            accessToken,
          });
        },
        onFailure: (err) => {
          logger.error(err);
          res.status(401).send(err);
        },
      });
    } catch (err) {
      logger.error(err);
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

  static #configureRefreshCredentials(result: CognitoUserSession) {
    const name = `cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${config.cognito.userPoolId}`;

    const cognitoIdentityCredentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: config.cognito.identityPoolId,
      Logins: {
        [name]: result.getIdToken().getJwtToken(),
      },
    });

    AWS.config.credentials = cognitoIdentityCredentials;

    cognitoIdentityCredentials.refresh((error) => {
      if (error) {
        logger.error(error);
      } else {
        logger.info("User login successful");
      }
    });
  }

  static register(req: Request, res: Response) {
    logger.info("Attempting user registration");

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
          logger.error(err);
          res.status(400).send(err);
        } else {
          logger.info("User registration successful");
          res.status(200).send(result);
        }
      }
    );
  }

  static verifyRegistration(req: Request, res: Response) {
    logger.info("Attempting user verification");

    const cognitoUser = AuthController.#createCognitoUser(req);

    cognitoUser.confirmRegistration(
      req.body.verificationCode,
      true,
      (err: Error, result: string) => {
        if (err) {
          logger.error(err);
          res.status(400).send(err);
        } else {
          logger.info("User verification successful");
          res.status(200).send(result);
        }
      }
    );
  }

  static logout(req: Request, res: Response) {
    logger.info("Attempting logout");
    try {
      const cognitoUser = AuthController.#createCognitoUser(req);

      cognitoUser.signOut();
      logger.info("Logout successful");
    } catch (err) {
      logger.error(err);
      res.status(400).send(err);
    }
  }

  // TODO
  static forgotPassword() {
    return false;
  }
}

export default AuthController;

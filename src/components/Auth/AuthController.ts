import { Request, Response } from "express";
import "cross-fetch/polyfill";
import * as AWS from "aws-sdk/global";
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserSession } from "amazon-cognito-identity-js";

import * as config from "../../config.js";
import logger from "../../utils/logger.js";

class AuthController {
  static #poolData = {
    UserPoolId: config.cognito.userPoolId,
    ClientId: config.cognito.clientId,
  };

  static #createUserPool(): CognitoUserPool {
    return new CognitoUserPool(AuthController.#poolData);
  }

  static login(req: Request, res: Response) {
    const userPool = AuthController.#createUserPool();
    const userData = {
      Username: req.body.username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    const authData = {
      Username: req.body.username,
      Password: req.body.password,
    };
    const authDetails = new AuthenticationDetails(authData);

    logger.info("Attempting user login");

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        AuthController.#configureRefreshCredentials(result);
        res.status(200).send({
          accessToken,
        });
      },
      onFailure: (err) => {
        logger.error(err);
        res.status(401).send(err);
      },
    });
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
        logger.info("Successfully logged in!");
      }
    });
  }

  static register() {
    AuthController.#createUserPool();
  }

  // TODO
  static logout() {
    return false;
  }

  // TODO
  static forgotPassword() {
    return false;
  }
}

export default AuthController;

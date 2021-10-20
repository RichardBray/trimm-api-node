import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

import logger from "../../utils/logger.js";
import AuthController from "../Auth/AuthController.js";
class ItemResolvers {
  static returnAllItems(req: Request) {
    logger.info("Returning all items");
    const userData: JwtPayload = AuthController.verifyAccessToken(req);
    console.log(userData.username, "username");
    return [
      {
        item_uuid: 1,
        item_name: "test",
        item_price: 9,
        create_dttm: null,
        user_id: 2,
        cat_id: 32,
      },
      {
        item_uuid: 2,
        item_name: "test_two",
        item_price: 90,
        create_dttm: null,
        user_id: 22,
        cat_id: 321,
      },
    ];
  }
}

export default ItemResolvers;

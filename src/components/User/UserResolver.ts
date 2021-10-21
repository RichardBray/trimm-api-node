import { JwtPayload } from "jsonwebtoken";

class UserResolvers {
  // TODO
  static userIfFromToken(decodedJwt: JwtPayload): number {
    return 5;
  }
}

export default UserResolvers;

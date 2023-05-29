import * as argon from "argon2";
import type { ResolverFn } from "../../../../typing";
import { UnauthorizedException } from "../../../helper/exceptions";
import redisGet from "../../../helper/redisGet";
import type { TokenObj } from "./forget-password";
import signToken from "./signToken";

interface Args {
  input: {
    token: number;
    email: string;
    password: string;
  };
}

interface ReturnValue {
  token: string;
}

const changePassword: ResolverFn<Args, ReturnValue> = async (_, args, ctx) => {
  try {
    const { email, password, token } = args.input;

    const user = await ctx.db.users.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!user) throw new Error("User not found");

    const key = `validate-user:${email}`;

    const redisCache = await redisGet<TokenObj>(key);

    if (!redisCache) throw UnauthorizedException("Unauthorized access");

    if (redisCache.token !== token)
      throw UnauthorizedException("Invalid token");

    const hash = await argon.hash(password);

    const updatedUser = await ctx.db.users.update({
      where: { email },
      data: { password: hash },
      select: { email: true, id: true },
    });

    // get jwt token
    const jwtToken = signToken(updatedUser.id, updatedUser.email);

    (ctx.req.session as any).auth = jwtToken;

    // delete token from session
    await ctx.redis.del(key);

    // returning jwt sign token
    return { token: jwtToken };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default changePassword;

import type { ResolverFn } from "../../../../typing";
import redisGet from "../../../helper/redisGet";
import type { TokenObj } from "./forget-password";

interface Args {
  input: {
    email: string;
    token: number;
  };
}

interface ReturnValue {
  validate: boolean;
}

const validateCode: ResolverFn<Args, ReturnValue> = async (_, args, ctx) => {
  try {
    const { email, token } = args.input;

    const user = await ctx.db.users.findUnique({ where: { email } });

    if (!user) throw new Error("User not found");

    const key = `validate-user:${email}`;

    const redisCache = await redisGet<TokenObj>(key);

    if (!redisCache) return { validate: false };

    console.log(redisCache);

    if (redisCache.token === token) return { validate: true };
    else return { validate: false };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default validateCode;

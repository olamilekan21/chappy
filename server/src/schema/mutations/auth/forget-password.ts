import type { MsgType, ResolverFn } from "../../../../typing";
import generateCode from "../../../helper/generateCode";

interface Args {
  email: string;
}

export interface TokenObj {
  email: string;
  token: number;
}

const forgetPassword: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { email } = args;
    let token = generateCode(11111, 99999);

    const user = await ctx.db.users.findUnique({ where: { email } });

    if (!user) throw new Error("User not found");

    const key = `validate-user:${email}`;

    let obj = { email, token };

    await ctx.redis.setex(key, 600, JSON.stringify(obj));

    console.log(obj);
    return { message: `Token sent to ${email} was successfully` };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default forgetPassword;

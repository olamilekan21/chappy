import * as argon from "argon2";
import type { Context, ResolverFn } from "../../../../typing";
import {
  ForbiddenException,
  UnauthorizedException,
} from "../../../helper/exceptions";
import signToken from "./signToken";

interface Args {
  input: {
    email: string;
    password: string;
  };
}

export interface ReturnToken {
  token: string;
}
const login: ResolverFn<Args, ReturnToken> = async (_, args, ctx) => {
  try {
    const { email, password } = args.input;

    // finding user with the email address
    const user = await ctx.db.users.findUnique({
      where: { email: `${email}` },
      select: { id: true, password: true, email: true },
    });

    // throw error if user does not exist
    if (!user) throw ForbiddenException("Invalid credentials");

    // verifying if entered password match db password
    const isPassword = await argon.verify(user.password, password);

    // throw error if entered does not match db password
    if (!isPassword) throw UnauthorizedException("Something went wrong");

    // get jwt token
    const token = signToken(user.id, user.email);

    (ctx.req.session as any).auth = token;

    // returning jwt sign token
    return { token };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default login;

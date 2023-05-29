import * as argon from "argon2";
import type { ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";
import { ForbiddenException } from "../../../helper/exceptions";
import getdel from "../../../helper/getdel";
import type { ReturnToken } from "./login";
import signToken from "./signToken";

type Args = {
  input: {
    password: string;
    displayName: string;
    email: string;
    gender: "Male" | "Female" | "none";
    birthday: Date;
  };
};

const register: ResolverFn<Args, ReturnToken> = async (_, args, ctx) => {
  try {
    const { email, password, birthday, displayName, gender } = args.input;

    // checking if user is already registered
    const isRegistered = await ctx.db.users.findUnique({ where: { email } });

    // throw error if user is already registered, can't register user twice
    if (isRegistered) throw ForbiddenException("Invalid credentials");

    // hashing the password
    const hash = await argon.hash(password);

    // storing new user credentials to the database
    const user = await ctx.db.users.create({
      data: clean({
        displayName,
        email,
        password: hash,
        gender,
        birthday: new Date(birthday),
      }),
    });

    // get jwt token
    const token = signToken(user.id, user.email);

    (ctx.req.session as any).auth = token;

    getdel([`users:${user.id}`]);

    // returning jwt sign token
    return { token };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default register;

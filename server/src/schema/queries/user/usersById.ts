import type { ResolverFn } from "../../../../typing";
import userTransform, { UserType } from "../../../transforms/userTransform";

interface Args {
  ids: string[];
}

const usersById: ResolverFn<Args, UserType[]> = async (_, args, ctx) => {
  try {
    const { ids } = args;

    // finding users with there ids
    const users = await ctx.userLoader.loadMany(ids);

    // transforming users data;
    const newUser = users.map((user) => userTransform(user));

    // returning transformed users
    return newUser;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default usersById;

import type { Context, MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";

interface Args {
  input: {
    name: string;
    bio: string;
    displayName: string;
    photoURL: string;
  };
}

const updateUser: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { db, user, redis } = ctx;

    // removing null value from input
    const data = clean(args.input);

    // update user in the database
    const res = await db.users.update({
      where: { id: user?.id! },
      data,
    });

    if (!res) throw new Error("Something went wrong while updating");

    await redis.del(`user:${user?.id}`)

    // returning success message if user was updated successfully
    return { message: "Successfully updated" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default updateUser;

import type { MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";
import { NotFoundException } from "../../../helper/exceptions";
import getdel from "../../../helper/getdel";

interface Args {
  input: {
    friendId: string;
    blocked?: boolean;
    archive?: boolean;
    pinned?: boolean;
  };
}
const updateFriend: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const userId = ctx.user?.id;
    const { friendId, ...others } = args.input;

    // removing null values
    const data = clean(others);

    // update authentication user friend with the entered friendId
    const res = await ctx.db.users.update({
      where: { id: userId! },
      data: { friends: { updateMany: { where: { friendId }, data } } },
      select: { friends: true },
    });

    // throw error if update is not successful
    if (!res)
      throw NotFoundException(`Friend with id ${friendId} does not exist`);

    // deleting cache
    await getdel([`friends:${userId}*`, `friends-block:${userId}`]);

    // return a success message if the user was successfully updated
    return { message: "Successfully updated" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default updateFriend;

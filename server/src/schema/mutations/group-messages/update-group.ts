import type { MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";

interface Args {
  input: {
    id: string;
    blocked?: boolean;
    archive?: boolean;
    pinned?: boolean;
  };
}
const updateGroup: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { id, ...others } = args.input;

    // removing null values
    const data = clean(others);

    // updating group details
    const res = await ctx.db.users.update({
      where: { id: ctx.user?.id! },
      data: { groups: { updateMany: { where: { chatId: id }, data } } },
      select: { groups: true },
    });

    // throw error if there was an error updating group
    if (!res) throw new Error("Something went wrong");

    // returning success message
    return { message: "Successfully updated" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default updateGroup;

import type { MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";
import { NotFoundException } from "../../../helper/exceptions";

interface Args {
  input: {
    chatId: string;
    name: string;
    image: string;
    description: string;
    visibility: "public" | "private";
  };
}

const editGroup: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { chatId, ...others } = args.input;

    // removing null values
    const data = clean(others);

    // updating the chat
    const res = await ctx.db.chats.updateMany({ where: { id: chatId }, data });

    // throw error if chat was not found
    if (res.count > 1 || res.count < 1)
      throw NotFoundException(`Chat with ${chatId} does't already exists`);

    await ctx.redis.del(`chats:${ctx.user?.id}`);

    // returning success message if not error
    return { message: "Successfully updated" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default editGroup;

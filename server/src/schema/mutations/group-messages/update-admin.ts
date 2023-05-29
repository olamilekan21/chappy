import type { MsgType, ResolverFn } from "../../../../typing";
import { ForbiddenException } from "../../../helper/exceptions";


interface Args {
  input: {
    chatId: string;
    uid: string;
    admin: boolean;
  };
}

const updateAdmin: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { chatId, uid, admin } = args.input;

    // getting the total number of admins
    const admins = await ctx.db.chatsUser.count({
      where: { chatsId: chatId, admin: true },
    });

    // throw error if admins length is equal to 5
    if (admins === 5 && admin)
      throw ForbiddenException(
        "Can't add new participant. Admin participants can't be more than 5 users"
      );

    // if admins length is less than 5 then update participants to admin
    const data = await ctx.db.chatsUser.updateMany({
      where: { AND: { chatsId: chatId, uid } },
      data: { admin: admin },
    });

    if (data.count !== 1) throw new Error("Something went wrong");

    await ctx.redis.del([
      `group-participant:${chatId}?uid=${ctx.user?.id}`,
      `group-admin:${chatId}?uid=${ctx.user?.id}`,
    ]);

    return { message: `Successfully updated` };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default updateAdmin;

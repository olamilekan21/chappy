import type { MsgType, ResolverFn } from "../../../../typing";
import { updateGroups } from "./create-group";

interface Args {
  input: {
    chatId: string;
    users: string[];
  };
}

const addParticipants: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { chatId, users } = args.input;

    // formatting entered users into what the database can take
    const usersData = users.map((user) => ({ uid: user, chatsId: chatId }));

    // creating new participants
    const data = await ctx.db.chatsUser.createMany({
      data: usersData,
      skipDuplicates: true,
    });

    // checking if participants where created
    if (data.count <= 0) throw new Error("Someting went wrong");

    for (let i = 0; i < users.length; i++) {
      const userId = users[i];
      await updateGroups(userId, chatId);
    }

    await ctx.redis.del([
      `group-participant:${chatId}?uid=${ctx.user?.id}`,
      `group-admin:${chatId}?uid=${ctx.user?.id}`,
    ]);

    // return success message
    return { message: "Users added" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default addParticipants;

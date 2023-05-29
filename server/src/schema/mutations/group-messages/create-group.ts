import type { MsgType, ResolverFn } from "../../../../typing";
import { prisma } from "../../../context";
import { nanoid } from "../../../helper/nanoid";
import transformChats from "../../../transforms/transformChats";

export enum VisibilityEnum {
  public = "public",
  private = "private",
}

interface Args {
  input: {
    name: string;
    visibility: "public" | "private";
    users: string[];
    image?: string;
  };
}
const createGroup: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { name, visibility, users, image } = args.input;
    const userId = ctx.user?.id!;

    // generating a unique id for the chatId
    const chatId = nanoid();

    // transforming users into participants
    const usersData = users.map((user) => ({ uid: user }));

    // creating a new chat with the generated chatId and users
    const data = await ctx.db.chats.create({
      data: {
        id: chatId,
        name,
        image,
        users: {
          createMany: {
            data: [
              ...usersData,
              {
                uid: userId,
                admin: true,
              },
            ],
          },
        },
        type: "group",
        visibility,
      },
      include: { users: true },
    });

    // throw error if there was an error creating chat
    if (!data) throw new Error("Something went wrong");

    // transform newly created chat
    const results = (
      await transformChats([{ ...data, messages: [] }], ctx.user?.id!)
    )[0];

    // updating group for participants
    let newUsers = [...users, userId];
    for (let i = 0; i < newUsers.length; i++) {
      const userId = newUsers[i];
      await updateGroups(userId, chatId);
    }

    await ctx.redis.del(newUsers.map((user) => `chats-${user}`));

    // returning success message
    return { message: "Group created successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const updateGroups = async (userId: string, chatId: string) => {
  return await prisma.users.update({
    where: { id: userId },
    data: { groups: { create: { chatId } } },
    include: { groups: true },
  });
};
export default createGroup;

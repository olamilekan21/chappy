import type {
  Chats,
  ChatsUser,
  Media,
  Reaction,
  messages,
} from "@prisma/client";
import { prisma } from "../context";
import userTransform, { UserType } from "./userTransform";
import { userLoader } from "../loaders";


interface Message extends messages {
  reactions: Reaction[];
  media: Media[];
}

interface ChatProps extends Chats {
  messages: Message[];
  users: ChatsUser[];
}

export interface ChatType extends ChatProps {
  pinned: boolean;
  blocked: boolean;
  archive: boolean;
  user: UserType | null;
}

const transformChats = async (
  chats: ChatProps[],
  userId: string
): Promise<ChatType[]> => {
  // creating a new chat array
  const newChats: ChatType[] = [];

  for (let i = 0; i < chats.length; i++) {
    const chat = chats[i];

    // checking for friendId
    const friendId = chat.users.find((user) => user.uid !== userId)!.uid;

    // find user if chat type is equal to chat
    const user = chat.type === "chat" ? await findUser(friendId) : null;

    const where = { AND: { chatId: chat?.id, usersId: userId } };

    const select = { archive: true, blocked: true, pinned: true };

    // getting a friend details
    const getFriend = async () =>
      await prisma.friends.findFirst({ where, select });

    // getting a group details
    const getGroup = async () =>
      await prisma.groups.findFirst({ where, select });

    // getting group details if chat type equals to group or friend details if chat type equals to friend
    const data = await (chat.type === "chat" ? getFriend() : getGroup());

    // getting last message if messages is not available
    const messages =
      chat.messages.length > 0 ? chat.messages : await getMessages(chat.id!);

    // pushing the new transform chat to the array
    newChats.push({ ...chat, ...data!, messages, user });
  }

  return newChats;
};

export default transformChats;

export const findUser = async (id: string): Promise<UserType> => {
  const user = await userLoader.load(id);
  return userTransform(user);
};

export const getMessages = async (chatId: string) =>
  await prisma.messages.findMany({
    where: { chatId },
    take: -1,
    include: { media: true, reactions: true },
    orderBy: { createdAt: "asc" },
  });

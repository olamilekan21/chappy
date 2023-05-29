import type {
  Chats,
  ChatsUser,
  Friends,
  Groups,
  Media,
  Reaction,
  messages,
} from "@prisma/client";
import { prisma } from "../context";
import { findUser, getMessages } from "./transformChats";
import type { UserType } from "./userTransform";

interface Props {
  friends: Friends[];
  groups: Groups[];
  uid: string;
}

interface Messages extends messages {
  reactions: Reaction[];
  media: Media[];
}

export interface ReturnChats extends Chats {
  pinned: boolean;
  blocked: boolean;
  archive: boolean;
  user?: UserType | null;
  users?: ChatsUser[];
  messages: Messages[];
}

const transformUsersToChat = async (props: Props): Promise<ReturnChats[]> => {
  const { friends, groups, uid } = props;

  // creating an empty array of chats
  const chats: ReturnChats[] = [];

  // marging friends and groups together
  const items = [...friends, ...groups];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // getting chat
    const chat = await getChat(item.chatId, uid);

    // if message length is equal to 0 get last message or return an empty array
    const messages = chat
      ? chat?.messages.length > 0
        ? chat.messages
        : await getMessages(chat.id!)
      : [];

    // finding user if friendId is provided
    const user = (item as Friends).friendId
      ? await findUser((item as Friends).friendId)
      : null;

      // pushing the new chat to the chats array
    chats.push({
      ...chat!,
      pinned: item?.pinned!,
      blocked: item?.blocked!,
      archive: item?.archive!,
      messages,
      user,
    });
  }

  return chats;
};

const getChat = async (chatId: string, uid: string) =>
  await prisma.chats.findFirst({
    where: { id: chatId },
    include: {
      users: true,
      messages: {
        where: { AND: { seen: false, senderId: { not: uid } } },
        include: { reactions: true, media: true },
      },
    },
  });

export default transformUsersToChat;

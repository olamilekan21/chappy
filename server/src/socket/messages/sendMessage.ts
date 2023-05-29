import type { Server, Socket } from "socket.io";
import { getActiveUsers } from "../data";

export type Media = {
  url: string;
  type: "image" | "video" | "audio";
};

export type MessageTypeEnum =
  | "text"
  | "textcaption"
  | "media"
  | "audio"
  | "file"
  | "voicenote"
  | "mediacaption";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  type: MessageTypeEnum;
  message?: string;
  captionRef?: string;
  gifs?: string;
  sticker?: string;
  media?: Media[];
  createdAt: Date;
  updatedAt: Date;
  seen: boolean;
}

interface DataProps {
  chatId: string;
  message: Message;
}

async function sendMessage(
  io: Server,
  socket: Socket,
  data: DataProps,
  fn: any
) {
  const activeUsers = await getActiveUsers();
  const user = activeUsers.find(
    (user) => user.userId === data.message.receiverId
  );

  if (user) io.to(user.socketId).emit("receive-message", data);

  fn?.();
}
export default sendMessage;

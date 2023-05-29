import type { Server, Socket } from "socket.io";
import { getActiveUsers } from "../data";

interface DataProps {
  receiverId: string;
  reaction: string;
  chatId: string;
  messageId: string;
  userId: string;
  remove?: boolean;
}
const updateReaction = async (io: Server, socket: Socket, data: DataProps) => {
  const activeUsers = await getActiveUsers();
  const user = activeUsers.find((user) => user.userId === data.receiverId);

  if (!user) return;
  io.to(user.socketId).emit("receive-update-reaction", {
    reaction: data.reaction,
    chatId: data.chatId,
    messageId: data.messageId,
    userId: data.userId,
    remove: data.remove,
  });
};
export default updateReaction;

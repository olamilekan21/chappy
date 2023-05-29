import type { Server, Socket } from "socket.io";
import { getActiveUsers } from "../data";

interface DataProps {
  receiverId: string;
  chatId: string;
  messageId: string;
}

const deleteMessage = async (io: Server, socket: Socket, data: DataProps) => {
  const activeUsers = await getActiveUsers();
  const user = activeUsers.find((user) => user.userId === data.receiverId);
  if (!user) return;
  io.to(user.socketId).emit("receive-delete-message", {
    chatId: data.chatId,
    messageId: data.messageId,
  });
};

export default deleteMessage;

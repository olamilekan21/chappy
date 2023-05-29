import type { Server, Socket } from "socket.io";
import { getActiveUsers } from "../data";

interface DataProps {
  chatId: string;
  messageId: string;
  receiverId: string;
}
const messageSeen = async (io: Server, socket: Socket, data: DataProps) => {
  const activeUsers = await getActiveUsers();
  const user = activeUsers.find((user) => user.userId === data.receiverId);

  if (!user) return;
  io.to(user.socketId).emit("receive-message-seen", {
    chatId: data.chatId,
    messageId: data.messageId,
  });
};

export default messageSeen;

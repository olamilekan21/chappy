import type { Server, Socket } from "socket.io";
import { getActiveUsers } from "../data";

interface DataProps {
  receiverId: string;
  senderId: string;
  status: "typing..." | "voice recording..." | null;
  chatId: string;
}

const sendStatus = async (io: Server, socket: Socket, data: DataProps) => {
  const activeUsers = await getActiveUsers();
  const user = activeUsers.find((user) => user.userId === data.receiverId);

  if (!user) return;
  io.to(user.socketId).emit("receive-status", {
    chatId: data.chatId,
    userId: data.senderId,
    status: data.status,
  });
};
export default sendStatus;

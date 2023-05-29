import type { Server, Socket } from "socket.io";
import { getActiveUsers } from "../data";

interface DataProps {
  receiverId: string;
}

async function CallEnded(io: Server, socket: Socket, data: DataProps) {
  const activeUsers = await getActiveUsers();

  const user = activeUsers.find((user) => user.userId === data.receiverId);

  if (!user) return;
  io.to(user.socketId).emit("user-call-ended", data);
}

export default CallEnded;

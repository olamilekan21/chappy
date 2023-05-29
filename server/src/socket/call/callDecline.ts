import type { Server, Socket } from "socket.io";
import { getActiveUsers } from "../data";

interface DataProps {
  receiverId: string;
}

async function callDecline(
  io: Server,
  socket: Socket,
  data: DataProps,
  fn: any
) {
  const activeUsers = await getActiveUsers();

  const user = activeUsers.find((user) => user.userId === data.receiverId);
  if (user) io.to(user.socketId).emit("user-call-declined", data);
  fn();
}

export default callDecline;

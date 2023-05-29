import type { Server, Socket } from "socket.io";
import { getActiveUsers } from "../data";

interface DataProps {
  receiverId: string;
  callType: "video" | "voice";
}

async function callAnswer(
  io: Server,
  socket: Socket,
  data: DataProps,
  fn: any
) {
  const activeUsers = await getActiveUsers();
  const user = activeUsers.find((user) => user.userId === data.receiverId);

  if (user) io.to(user.socketId).emit("user-call-accepted", data);
  fn();
}

export default callAnswer;

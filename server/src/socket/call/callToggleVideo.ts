import type { Server, Socket } from "socket.io";
import { getActiveUsers } from "../data";

interface DataProps {
  receiverId: string;
  uid: string;
  muted: boolean;
  callType: "voice" | "video";
}

async function callToggleVideo(
  io: Server,
  socket: Socket,
  data: DataProps,
  fn: any
) {
  const activeUsers = await getActiveUsers();

  const user = activeUsers.find((user) => user.userId === data.receiverId);
  if (user) io.to(user.socketId).emit("user-toggle-video-pause", data);
  fn();
}

export default callToggleVideo;

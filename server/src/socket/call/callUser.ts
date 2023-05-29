import type { Server, Socket } from "socket.io";
import { getActiveUsers } from "../data";

interface CallUser {
  uid: string;
  displayName: string;
  photoURL: string;
  muted: boolean;
  callInitiator: boolean;
}

interface DataProps {
  chatId: string;
  users: CallUser[];
  chatType: "chat" | "group";
  callType: "voice" | "video";
}

async function callUser(io: Server, socket: Socket, data: DataProps, fn: any) {
  const activeUsers = await getActiveUsers();
  const receiverUser = data.users.find((user) => !user.callInitiator)!;
  const user = activeUsers.find((user) => user.userId === receiverUser.uid);

  if (user) io.to(user.socketId).emit("calling-user", data);
  fn();
}

export default callUser;

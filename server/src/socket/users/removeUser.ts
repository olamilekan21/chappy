import type { Server } from "socket.io";
import type { SocketType } from "../../../typing";
import { addUsers, getActiveUsers } from "../data";

async function removeUser(io: Server, socket: SocketType) {
  const activeUsers = await getActiveUsers();

  const users = activeUsers.filter((user) => user.socketId !== socket.id);
  addUsers(users);
  io.emit("get-users", users);
}
export default removeUser;

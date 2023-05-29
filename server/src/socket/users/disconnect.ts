import type { Server } from "socket.io";
import type { SocketType } from "../../../typing";
import { addUsers, getActiveUsers } from "../data";
import removeUser from "./removeUser";

async function disconnect(io: Server, socket: SocketType) {
  await removeUser(io, socket);
  socket.broadcast.emit("user-disconnected", socket.user);
}
export default disconnect;

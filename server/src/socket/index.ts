import type { Server } from "socket.io";
import type { SocketType } from "../../typing";
import callHandler from "./call";
import messagesHandler from "./messages";
import { addNewUser, disconnect } from "./users";

const socketHandler = (io: Server, socket: SocketType) => {
  addNewUser(io, socket);
  messagesHandler(io, socket);
  callHandler(io, socket);
  socket.on("disconnect", () => disconnect(io, socket));
};
export default socketHandler;

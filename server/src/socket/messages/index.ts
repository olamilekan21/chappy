import type { Server } from "socket.io";
import type { SocketType } from "../../../typing";
import deleteMessage from "./deleteMessage";
import messageSeen from "./messageSeen";
import sendMessage from "./sendMessage";
import sendStatus from "./sendStatus";
import updateReaction from "./updateReaction";

const messagesHandler = (io: Server, socket: SocketType) => {
  socket.on("send-message", (data, fn) => sendMessage(io, socket, data, fn));
  socket.on("send-status", (data) => sendStatus(io, socket, data));
  socket.on("message-seen", (data) => messageSeen(io, socket, data));
  socket.on("delete-message", (data) => deleteMessage(io, socket, data));
  socket.on("update-reaction", (data) => updateReaction(io, socket, data));
};

export { deleteMessage, messageSeen, sendMessage, sendStatus, updateReaction };

export default messagesHandler;

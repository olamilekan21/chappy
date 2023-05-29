import type { Server } from "socket.io";
import type { SocketType } from "../../../typing";
import callAnswer from "./callAnswer";
import callDecline from "./callDecline";
import callEnded from "./callEnded";
import callToggleMuted from "./callToggleMuted";
import callToggleVideo from "./callToggleVideo";
import callUser from "./callUser";

const callHandler = (io: Server, socket: SocketType) => {
  socket.on("call-user", (data, fn) => callUser(io, socket, data, fn));
  socket.on("call-answer", (data, fn) => callAnswer(io, socket, data, fn));
  socket.on("call-decline", (data, fn) => callDecline(io, socket, data, fn));
  socket.on("call-ended", (data) => callEnded(io, socket, data));
  socket.on("call-toggle-muted", (data, fn) =>
    callToggleMuted(io, socket, data, fn)
  );
  socket.on("call-toggle-video-pause", (data, fn) =>
    callToggleVideo(io, socket, data, fn)
  );
};

export {
  callAnswer,
  callDecline,
  callToggleMuted,
  callEnded,
  callUser,
  callToggleVideo,
};

export default callHandler;

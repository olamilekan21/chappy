import type { ExtendedError } from "socket.io/dist/namespace";
import type { SocketType } from "../../typing";

const socketAuthenticated = (
  socket: SocketType,
  next: (err?: ExtendedError) => void
) => {
  try {
    const auth = socket.handshake.auth;

    const user = {
      userId: auth.sub!,
      email: auth.email,
    };

    socket.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default socketAuthenticated;

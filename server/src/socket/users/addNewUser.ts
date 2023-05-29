import type { Server } from "socket.io";
import type { SocketType } from "../../../typing";
import { addUsers, getActiveUsers } from "../data";

async function addNewUser(io: Server, socket: SocketType) {
  const { email, userId } = socket.user!;

  const users = await getActiveUsers();
  let newUsers = [...users];
  let index = newUsers.findIndex((user) => user.userId === userId);
  let data = { socketId: socket.id, userId, email };

  if (index === -1) newUsers.push(data);
  else newUsers[index] = data;

  addUsers(newUsers);

  io.emit("get-users", newUsers);
}

export default addNewUser;

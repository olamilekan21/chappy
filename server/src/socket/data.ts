import type { ActiveUser } from "../../typing";
import { redis } from "../context";

let key = "active-users";

const getActiveUsers = async (): Promise<ActiveUser[]> => {
  const activeUsers = await redis.get(key);

  return activeUsers ? JSON.parse(activeUsers) : [];
};

const addUsers = async (user: ActiveUser[]) => {
  await redis.set(key, JSON.stringify(user));
};
export { getActiveUsers, addUsers };

import {
  Friends,
  FriendsRequest,
  Groups,
  PrismaClient,
  users,
} from "@prisma/client";
import type DataLoader from "dataloader";
import type { Request, Response } from "express";
import type { Redis } from "ioredis";
import type { Socket } from "socket.io";

export interface User extends Omit<users, "password"> {
  // friends: Friends[];
  // groups: Groups[];
  // friendsRequest: FriendsRequest[];
}
export interface Context {
  user: User | null;
  db: PrismaClient;
  res: Response;
  req: Request;
  redis: Redis;
  userLoader: DataLoader<unknown, User, unknown>;
}

export type ResolverFn<Args = any, Results = any> = (
  _: any,
  args: Args,
  ctx: Context,
  info: any
) => Promise<Results>;

export interface WsContext {
  uid: string;
}

export interface MsgType {
  message: string;
}

export interface SocketUser {
  userId: string;
  email: string;
}

export interface SocketType extends Socket {
  user?: SocketUser;
}

export interface ActiveUser extends SocketUser {
  socketId: string;
}

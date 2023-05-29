import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import Redis from "ioredis";
import type { Context } from "../typing";
import { userLoader } from "./loaders";
import authenticated from "./middleware/authenticated";

interface Props {
  res: Response;
  req: Request;
}

const userSelect = {
  bio: true,
  birthday: true,
  createdAt: true,
  disabled: true,
  displayName: true,
  email: true,
  gender: true,
  id: true,
  name: true,
  photoURL: true,
  updatedAt: true,
};

const prisma = new PrismaClient();
const redis = new Redis();

const context = async ({ req, res }: Props): Promise<Context> => {
  const user = await authenticated(req);

  return { user, db: prisma, req, res, redis,userLoader };
};

export { prisma, userSelect, redis };

export default context;

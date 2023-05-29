import type { users } from "@prisma/client";
import DataLoader from "dataloader";
import { prisma } from "../context";

const userLoader = new DataLoader<string, Omit<users, "password">, string>(
  async (keys) => {
    const results = await prisma.users.findMany({
      where: { id: { in: keys as string[] } },
      select: {
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
      },
    });
    return keys.map(
      (key) =>
        results.find((r) => r.id === key) || new Error(`No result for ${key}`)
    );
  }
);

export default userLoader;

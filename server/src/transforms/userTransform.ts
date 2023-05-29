import type { users } from "@prisma/client";
import clean from "../helper/clean";

export interface UserType extends Omit<users, "password" | "id"> {
  uid: string;
}

const userTransform = <T = UserType>(user: any): T => {
  return clean<T>({
    ...user,
    uid: user.id,
    id: null,
  });
};

export default userTransform;

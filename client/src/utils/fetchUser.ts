import request, { gql } from "graphql-request";
import { z } from "zod";
import { UserResponse, UserType } from "../../typing";
export const UserQuery = gql`
  query User($uid: ID) {
    user(uid: $uid) {
      uid
      email
      name
      displayName
      photoURL
      bio
      gender
      birthday
      createdAt
    }
  }
`;

const fetchUser = async (token: string): Promise<UserType> => {
  const res = await request<UserResponse>(
    process.env.SERVER_URL!,
    UserQuery,
    {},
    {
      authorization: `Bearer ${token}`,
    }
  );

  const schema = z.object({
    uid: z.string().uuid(),
    email: z.string().email(),
    name: z.string().nullable(),
    displayName: z.string(),
    photoURL: z.string().nullable(),
    bio: z.string().nullable(),
    gender: z.enum(["Male", "Female", "none"]),
    birthday: z.string(),
    createdAt: z.string(),
  });

  const saveParse = schema.safeParse(res.user);

  if(!saveParse.success) throw new Error("Something went wrong")

  return saveParse.data as any;
};

export default fetchUser;

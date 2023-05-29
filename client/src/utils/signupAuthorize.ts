import request, { gql } from "graphql-request";
import jwt_decode from "jwt-decode";
import { Awaitable, User } from "next-auth";
import { z } from "zod";
import { RegisterResponse, TokenUser } from "../../typing";
import fetchUser from "./fetchUser";
import { Req } from "./signinAuthorize";

const RegisterMutation = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
    }
  }
`;

type Credentials =
  | Record<"email" | "displayName" | "password" | "birthday", string>
  | undefined;
type SignUpAuthorize = (
  credentials: Credentials,
  req: Req
) => Awaitable<User | null>;

const signupAuthorize: SignUpAuthorize = async (credentials) => {
  try {
    const schema = z.object({
      email: z
        .string({
          required_error: "Email address must be provided",
        })
        .email(),
      displayName: z
        .string({
          required_error: "Username must be provided",
        })
        .min(3, "Must be 3 characters or higher")
        .max(20, "Must be 20 characters or less"),
      birthday: z.date({
        required_error: "Birthday must be provided",
      }),
      password: z
        .string({
          required_error: "Password must be provided",
        })
        .min(8, "Password must be at least 8 characters"),
    });

    const saveParse = schema.safeParse(credentials);

    if (!saveParse.success && saveParse.error) {
      const message = saveParse.error.errors
        .map((err) => err.message)
        .join(", ");
      throw new Error(message);
    }

    const res = await request<RegisterResponse>(
      process.env.SERVER_URL!,
      RegisterMutation,
      {
        input: { ...(saveParse as any).data!, gender: "none" },
      }
    );

    const user = await fetchUser(res.register.token);

    return {
      id: user.uid,
      ...user,
      accessToken: res.register.token,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export default signupAuthorize;

import request, { gql } from "graphql-request";
import jwt_decode from "jwt-decode";
import { Awaitable, User } from "next-auth";
import { z } from "zod";
import { ChangePasswordResponse, TokenUser } from "../../typing";
import { Req } from "./signinAuthorize";

const PasswordMutation = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      access_token
    }
  }
`;

type Credentials = Record<"email" | "password" | "token", string> | undefined;
type SigninAuthorize = (
  credentials: Credentials,
  req: Req
) => Awaitable<User | null>;

const changePasswordAuthorize: SigninAuthorize = async (credentials) => {
  try {
    const schema = z.object({
      email: z
        .string({
          required_error: "Email address must be provided",
        })
        .email(),
      token: z.string(),
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

    const res = await request<ChangePasswordResponse>(
      process.env.SERVER_URL!,
      PasswordMutation,
      {
        input: (saveParse as any).data!,
      }
    );

    const user = jwt_decode<TokenUser>(res.changePassword.token);

    return {
      id: user.sid,
      email: user.email,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default changePasswordAuthorize;

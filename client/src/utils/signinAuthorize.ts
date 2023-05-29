import request, { gql } from "graphql-request";
import type { Awaitable, RequestInternal, User } from "next-auth";
import { z } from "zod";
import { LoginResponse } from "../../typing";
import fetchUser from "./fetchUser";

export type Req = Pick<
  RequestInternal,
  "body" | "query" | "headers" | "method"
>;
type Credentials = Record<"email" | "password", string> | undefined;
type SigninAuthorize = (
  credentials: Credentials,
  req: Req
) => Awaitable<User | null>;

const LoginMutation = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
`;

const signinAuthorize: SigninAuthorize = async (credentials, req) => {
  try {
    const schema = z.object({
      email: z
        .string({
          required_error: "Email address must be provided",
        })
        .email(),
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

    const res = await request<LoginResponse>(
      process.env.SERVER_URL!,
      LoginMutation,
      {
        input: (saveParse as any).data!,
      }
    );

    const user = await fetchUser(res.login.token);

    console.log(user);

    return {
      id: user.uid,
      ...user,
      accessToken: res.login.token,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

export default signinAuthorize;

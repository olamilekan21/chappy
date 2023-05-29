import type { GraphQLResolveInfo } from "graphql";
import { and, inputRule, not, rule } from "graphql-shield";
import type { Context } from "../../typing";

const loginInput = inputRule()((yup) =>
  yup.object({
    input: yup.object().shape({
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email or username is required"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
  })
);

const registerInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      displayName: yup
        .string()
        .min(5, "username must be at least 5 characters")
        .required(),
      email: yup.string().email("Invalid email address").required(),
      gender: yup.string().oneOf(["Male", "Female", "none"]).required(),
      birthday: yup
        .date()
        .max(new Date("2012-01-01"), "Must be 10 years old")
        .required(),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required(),
    }),
  })
);

const ONE_DAY = 60 * 60 * 24;
const rateLimit = rule()(
  async (_: any, args: any, ctx: Context, info: GraphQLResolveInfo) => {
    const { req, redis } = ctx;
    const key = `rate-limit:${info.fieldName}:${req.ip}`;

    const current = await redis.incr(key);

    if (current > 10) return false;
    else if (current === 1) await redis.expire(key, ONE_DAY);

    return true;
  }
);

const isEmail = inputRule()((yup) =>
  yup.object({
    email: yup.string().email("Invalid email address").required(),
  })
);

const validateCodeInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      email: yup.string().email("Invalid email address").required(),
      token: yup.string().length(5).required(),
    }),
  })
);

const changePasswordInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      email: yup.string().email("Invalid email address").required(),
      token: yup.number().min(11111).max(99999).required(),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required(),
    }),
  })
);

const isAuthenticated = rule()(
  async (_: any, args: any, ctx: Context) => ctx.user !== null
);

const authMutation = {
  login: and(
    loginInput,
    rateLimit,
    not(isAuthenticated, "Your are already authenticated")
  ),
  register: and(
    registerInput,
    rateLimit,
    not(isAuthenticated, "Your are already authenticated")
  ),
  forgetPassword: and(rateLimit, isEmail, not(isAuthenticated)),
  validateCode: and(validateCodeInput, not(isAuthenticated)),
  changePassword: and(changePasswordInput, not(isAuthenticated)),
  logout: isAuthenticated,
};
export { authMutation, isAuthenticated };

import type { MsgType, ResolverFn } from "../../../../typing";

const logout: ResolverFn<any, MsgType> = async (_, args, ctx) => {
  try {
    const { db, user, redis } = ctx;

    await redis.del(`auth-user:${user?.id}`);
    await redis.del(`user:${user?.id}`);
    ctx.req.session.destroy(() => {});
    return { message: "Logout successfull" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default logout;

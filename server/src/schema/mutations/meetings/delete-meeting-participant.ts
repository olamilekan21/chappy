import type { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  input: {
    meetingId: string;
    uid: string;
  };
}

const deleteMeetingParticipant: ResolverFn<Args, MsgType> = async (
  _,
  args,
  ctx
) => {
  try {
    const { meetingId, uid } = args.input;

    const data = await ctx.db.meetingsParticipants.deleteMany({
      where: { meetingId, uid },
    });

    if (data.count !== 1) throw new Error("Something went wrong");

    return { message: "Successfully removed participants" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteMeetingParticipant;

import type { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  input: {
    usersIds: string[];
    meetingId: string;
  };
}

const addParticipantToMeeting: ResolverFn<Args, MsgType> = async (
  _,
  args,
  ctx
) => {
  try {
    const { usersIds, meetingId } = args.input;

    const users = usersIds.map((uid) => ({ uid, meetingId }));

    const data = await ctx.db.meetingsParticipants.createMany({
      data: users,
    });

    if (data.count < 1) throw new Error("Something went wrong");

    return { message: "Participants added successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default addParticipantToMeeting;

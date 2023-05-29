import type { MsgType, ResolverFn } from "../../../../typing";
import clean from "../../../helper/clean";

interface Args {
  input: {
    meetingId: string;
    name?: string;
    meetingDate?: string;
    joinType?: "anyone" | "selected";
    callType?: "voice" | "video";
  };
}

const updateMeeting: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { callType, joinType, meetingDate, name, meetingId } = args.input;
    const { db, user } = ctx;

    // checking if authenticated user can edit
    const canEdit = await db.meetingsParticipants.findFirst({
      where: { meetingId, admin: true, uid: user?.id },
    });

    // if not throw error
    if (!canEdit) throw new Error("You don't have permission to edit");

    // removing undefined and null values
    const data = clean({
      callType,
      joinType,
      meetingDate: meetingDate ? new Date(meetingDate) : null,
      name,
    });

    // updating meeting except participants
    const resData = await db.meetings.update({
      where: { id: meetingId },
      data,
    });

    // if there was an error while updating throw an error
    if (!resData) throw new Error("Something went wrong");

    return { message: "Updated successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default updateMeeting;

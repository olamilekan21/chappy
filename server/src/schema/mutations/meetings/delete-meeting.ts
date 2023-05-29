import type { MsgType, ResolverFn } from "../../../../typing";

interface Args {
  meetingId: string;
}
const deleteMeeting: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { db, user } = ctx;
    const { meetingId } = args;

    // checking if authenticated user can edit
    const canEdit = await db.meetingsParticipants.findFirst({
      where: { meetingId, admin: true, uid: user?.id },
    });

    // if not throw error
    if (!canEdit) throw new Error("You don't have permission to edit");

    // if authenticated user can edit then delete meetings
    const data = await db.meetings.delete({ where: { id: meetingId } });

    // if error when deleting throw error
    if (!data) throw new Error("Something went wrong");

    // return a success message
    return { message: "Deleted successfully" };
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};
export default deleteMeeting;

import type { ResolverFn } from "../../../../typing";
import { nanoid } from "../../../helper/nanoid";
import meetingTransform, {
  MeetingType,
} from "../../../transforms/meetingTransform";

interface Args {
  input: {
    name: string;
    meetingDate: string;
    participants: string[];
    joinType: "anyone" | "selected";
    callType: "voice" | "video";
  };
}

const createMeeting: ResolverFn<Args, MeetingType> = async (_, args, ctx) => {
  try {
    const { callType, joinType, meetingDate, name, participants } = args.input;
    const { db, user } = ctx;
    const userId = user?.id!;

    // generating a unique id for the chatId
    const chatId = nanoid();

    // transforming users into participants
    const usersData = participants.map((uid) => ({ uid }));

    // creating a new chat with the generated chatId and users
    const data = await db.meetings.create({
      data: {
        id: chatId,
        name,
        participants: {
          createMany: {
            data: [
              ...usersData,
              {
                uid: userId,
                admin: true,
              },
            ],
          },
        },
        callType,
        joinType,
        meetingDate: new Date(meetingDate),
      },
      include: { participants: true },
    });

    // throw error if there was an error creating chat
    if (!data) throw new Error("Something went wrong");

    const results = await meetingTransform([data]);

    return results[0];
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default createMeeting;

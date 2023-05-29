import type { Meetings, MeetingsParticipants, users } from "@prisma/client";
import { userLoader } from "../loaders";

interface Args extends Meetings {
  participants: Omit<MeetingsParticipants, "meetingId">[];
}

export interface MeetingType extends Meetings {
  participants: {
    uid: string;
    admin: boolean;
    displayName: string;
    email: string;
    photoURL: string | null;
  }[];
}

const meetingTransform = async (meetings: Args[]): Promise<MeetingType[]> => {
  const results = [];

  for (let i = 0; i < meetings.length; i++) {
    const meeting = meetings[i];

    const usersIds = meeting.participants.map((user) => user.uid);

    const users = await userLoader.loadMany(usersIds);

    const newUsers = users.map((user) => ({
      displayName: (user as users)?.displayName,
      email: (user as users)?.email,
      photoURL: (user as users)?.photoURL,
      ...meeting.participants.find((p) => p.uid === (user as users).id)!,
    }));

    results.push({ ...meeting, participants: newUsers });
  }
  return results;
};
export default meetingTransform;

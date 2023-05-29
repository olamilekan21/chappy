import { and, inputRule, rule } from "graphql-shield";
import { isAuthenticated } from "./auth";
import { isPagination } from "./user";
import type { Context } from "../../typing";

const createMeetingInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      name: yup.string().required(),
      meetingDate: yup.string().required(),
      participants: yup.array().of(yup.string().required()).required(),
      joinType: yup.string().oneOf(["anyone", "selected"]).required(),
      callType: yup.string().oneOf(["video", "voice"]).required(),
    }),
  })
);

const isMeetingId = inputRule()((yup) =>
  yup.object({
    meetingId: yup.string().length(21).required(),
  })
);
const updateMeetingInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      meetingId: yup.string().length(21).required(),
      name: yup.string().nullable(),
      meetingDate: yup.string().nullable(),
      joinType: yup.string().oneOf(["anyone", "selected"]).nullable(),
      callType: yup.string().oneOf(["video", "voice"]).nullable(),
    }),
  })
);

const addParticipantToMeetingInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      meetingId: yup.string().length(21).required().required(),
      usersIds: yup.array().of(yup.string().uuid().required()).required(),
    }),
  })
);

const deleteMeetingParticipantInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      meetingId: yup.string().length(21).required().required(),
      uid: yup.string().uuid().required(),
    }),
  })
);

type Args_1 = { input: { meetingId: string } };
type Args_2 = { meetingId: string };

const canEditMeeting = rule()(
  async (_: any, args: Args_1 | Args_2, ctx: Context) => {
    const meetingId =
      (args as Args_1).input.meetingId ?? (args as Args_2).meetingId;
    const uid = ctx.user?.id!;

    const data = await ctx.db.meetingsParticipants.findFirst({
      where: { meetingId, uid, admin: true },
    });

    return !!data;
  }
);

const meetingsQuery = {
  meetings: and(isAuthenticated, isPagination),
};
const meetingsMutation = {
  createMeeting: and(isAuthenticated, createMeetingInput),
  deleteMeeting: and(isAuthenticated, isMeetingId, canEditMeeting),
  updateMeeting: and(isAuthenticated, updateMeetingInput, canEditMeeting),
  addParticipantToMeeting: and(
    isAuthenticated,
    addParticipantToMeetingInput,
    canEditMeeting
  ),
  deleteMeetingParticipant: and(
    isAuthenticated,
    deleteMeetingParticipantInput,
    canEditMeeting
  ),
};

export { meetingsMutation, meetingsQuery };

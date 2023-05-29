import { gql } from "graphql-tag";

const meetingTypes = gql`
  enum JoinTypeEnum {
    selected
    anyone
  }

  enum CallTypeEnum {
    voice
    video
  }

  type MeetingsParticipants {
    uid: String!
    email: String!
    displayName: String!
    photoURL: String
    admin: Boolean!
  }

  type Meeting {
    id: String!
    name: String!
    meetingDate: DateTime!
    joinType: JoinTypeEnum!
    callType: CallTypeEnum!
    createdAt: DateTime!
    updatedAt: DateTime!
    participants: [MeetingsParticipants!]!
  }

  type MeetingType {
    totalItems: Int!
    results: [Meeting!]!
  }

  input CreateMeetingInput {
    name: String!
    meetingDate: String!
    participants: [String!]!
    joinType: JoinTypeEnum!
    callType: CallTypeEnum!
  }

  input UpdateMeetingInput {
    meetingId: ID!
    name: String
    meetingDate: String
    joinType: JoinTypeEnum
    callType: CallTypeEnum
  }

  input AddParticipantToMeetingInput {
    meetingId: String!
    usersIds: [String!]!
  }

  input DeleteMeetingParticipantInput {
    meetingId: String!
    uid: String!
  }

  extend type Query {
    meetings(offset: Int, limit: Int): MeetingType!
  }
  extend type Mutation {
    createMeeting(input: CreateMeetingInput!): Meeting!
    addParticipantToMeeting(input: AddParticipantToMeetingInput!): MsgType!
    updateMeeting(input: UpdateMeetingInput!): MsgType!
    deleteMeeting(meetingId: ID!): MsgType!
    deleteMeetingParticipant(input: DeleteMeetingParticipantInput!): MsgType!
  }
`;
export default meetingTypes;

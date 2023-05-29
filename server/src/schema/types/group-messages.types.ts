import gql from "graphql-tag";

const groupMessagesTypes = gql`
  input CreateGroupInput {
    name: String!
    visibility: VisibilityEnum!
    users: [String!]!
    image: String
  }

  input CreateGroupMessageInput {
    chatId: ID!
    type: MessageTypeEnum!
    message: String
    captionRef: ID
    gifs: String
    sticker: String
    media: [MediaInput]
  }

  enum VisibilityEnum {
    public
    private
  }

  input UpdateGroupInput {
    id: String!
    blocked: Boolean
    archive: Boolean
    pinned: Boolean
  }

  input LeaveGroupInput {
    chatId: String!
    ids: [ID!]
  }

  input UpdateAdminInput {
    chatId: String!
    uid: String!
    admin: Boolean!
  }

  input AddParticipantsInput {
    users: [ID!]!
    chatId: String!
  }

  input RemoveParticipantInput {
    chatId: String!
    uid: String!
  }

  input EditGroupInput {
    chatId: String!
    name: String
    description: String
    visibility: VisibilityEnum
    image: String
  }


  extend type Mutation {
    createGroup(input: CreateGroupInput!): MsgType!
    createGroupMessage(input: CreateGroupMessageInput!): MessageType!
    addParticipants(input: AddParticipantsInput!): MsgType!
    updateGroup(input: UpdateGroupInput!): MsgType!
    updateAdmin(input: UpdateAdminInput!): MsgType!
    leaveGroup(input: LeaveGroupInput!): MsgType!
    removeParticipant(input: RemoveParticipantInput!): MsgType!
    editGroup(input: EditGroupInput!): MsgType!
  }
`;
export default groupMessagesTypes;

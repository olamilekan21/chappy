import gql from "graphql-tag";

const messagesType = gql`
  type MediaType {
    id: ID!
    url: String!
    type: MediaTypeEnum!
  }

  enum MediaTypeEnum {
    image
    video
    audio
  }

  type MessageType {
    id: ID!
    senderId: ID!
    receiverId: ID!
    type: MessageTypeEnum!
    captionRef: ID
    message: String
    gifs: String
    sticker: String
    reactions: [Reaction!]!
    media: [MediaType!]
    seen: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Reaction {
    reaction: String!
    userIds: [String]
  }

  type MessageSeenCreated {
    messageId: String!
    receiverId: ID!
  }

  enum MessageTypeEnum {
    text
    media
    audio
    file
    voicenote
    textcaption
    voicenotecaption
    mediacaption
  }

  type MessagesType {
    totalItems: Int!
    results: [MessageType!]!
  }

  type UploadType {
    url: String!
  }

  input MessagesInput {
    chatId: String!
    offset: Int
    limit: Int
  }

  input MessageInput {
    chatId: ID!
    messageId: ID!
  }

  input CreateMessageInput {
    chatId: ID!
    receiverId: ID!
    type: MessageTypeEnum!
    message: String
    captionRef: ID
    gifs: String
    sticker: String
    media: [MediaInput]
  }

  input MediaInput {
    type: MediaTypeEnum!
    url: String!
  }

  input AddReactionInput {
    messageId: String!
    reaction: String!
  }

  extend type Query {
    messages(input: MessagesInput!): MessagesType!
    message(input: MessageInput!): MessageType!
    lastMessage(chatId: String!): MessageType
  }
  extend type Mutation {
    createMessage(input: CreateMessageInput!): MessageType!
    messageSeen(messageId: String!): MsgType!
    deleteMessage(messageId: String!): MsgType!
    addReaction(input: AddReactionInput!): MsgType!
    removeReaction(input: AddReactionInput!): MsgType!
    uploadFile(file: Upload!): UploadType!
    uploadFiles(files: [Upload!]!): [UploadType!]!
    uploadBlob(blob: Upload): UploadType!
    markMessagesAsRead(chatId: ID!): MsgType!
  }
`;
export default messagesType;

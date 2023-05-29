import { gql } from "graphql-tag";

const chatsType = gql`
  enum ChatTypeEnum {
    group
    chat
  }

  enum ChatVisibilityEnum {
    public
    private
  }

  type ChatUser {
    id: String!
    uid: String!
    admin: Boolean!
  }

  type ChatType {
    id: ID!
    users: [ChatUser!]!
    user: User
    disabled: Boolean!
    name: String
    image: String
    description: String
    pinned: Boolean!
    archive: Boolean!
    blocked: Boolean!
    messages: [MessageType!]!
    type: ChatTypeEnum
    visibility: ChatVisibilityEnum
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ChatsType {
    totalItems: Int!
    results: [ChatType!]!
  }

  type ChatsSearchType {
    search: String!
    totalItems: Int!
    results: [ChatType!]!
  }

  input ChatsInput {
    offset: Int
    limit: Int
    archive: Boolean
  }

  input ChatsSearchInput {
    offset: Int = 0
    limit: Int = 20
    archive: Boolean = false
    search: String!
  }

  extend type Query {
    chat(chatId: String!): ChatType!
    chats(input: ChatsInput = {}): ChatsType!
    chatsSearch(input: ChatsSearchInput = {}): ChatsSearchType!
    findMedia(chatId: ID!): [MediaType!]!
  }
`;
export default chatsType;

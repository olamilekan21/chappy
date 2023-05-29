import { gql } from "graphql-tag";
const authTypes = gql`
  type UserToken {
    token: String!
  }

  enum Gender {
    Male
    Female
    none
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    displayName: String!
    email: String!
    gender: Gender!
    birthday: String!
    password: String!
  }

  input ValidateCodeInput {
    email: String!
    token: Float!
  }

  input ChangePasswordInput {
    token: Int!
    email: String!
    password: String!
  }

  type ValidateType {
    validate: Boolean!
  }

  extend type Mutation {
    login(input: LoginInput!): UserToken!
    register(input: RegisterInput!): UserToken!
    forgetPassword(email: String!): MsgType!
    validateCode(input: ValidateCodeInput!): ValidateType!
    changePassword(input: ChangePasswordInput!): UserToken!
    logout: MsgType!
  }
`;

export default authTypes;

import Mutation from "./mutations";
import Query from "./queries";
import dateScalar from "./scalars/dateScalar";
import typeDefs from "./types";
import { DateTimeResolver,DateResolver } from "graphql-scalars"

const resolvers = {
  Query,
  Mutation,
  Upload: require("graphql-upload-minimal").GraphQLUpload,
  // Date: dateScalar,
  DateTime: DateTimeResolver
};
export { resolvers, typeDefs };

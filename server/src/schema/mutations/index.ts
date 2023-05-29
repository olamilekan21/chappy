import merge from "lodash.merge";
import auth from "./auth";
import friendRequest from "./friend-request";
import friends from "./friends";
import groupMessages from "./group-messages";
import meetings from "./meetings";
import messages from "./messages";
import user from "./user";

const Mutation = merge(
  auth,
  friendRequest,
  friends,
  messages,
  groupMessages,
  user,
  meetings
);
export default Mutation;

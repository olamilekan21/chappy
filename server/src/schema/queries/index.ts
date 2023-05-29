import merge from "lodash.merge";
import chats from "./chats";
import friendRequest from "./friend-request";
import friends from "./friends";
import meetings from "./meetings";
import messages from "./messages";
import user from "./user";

const Query = merge(user, friendRequest, friends, messages, chats, meetings);
export default Query;

import type { MsgType, ResolverFn } from "../../../../typing";
import { NotFoundException } from "../../../helper/exceptions";

interface Args {
  messageId: string;
}
const deleteMessage: ResolverFn<Args, MsgType> = async (_, args, ctx) => {
  try {
    const { messageId } = args;

    // deleting the message from database
    const data = await ctx.db.messages.delete({ where: { id: messageId } });

    // throw error if the message is not deleted successfully
    if (!data) throw NotFoundException("Message not found");

    // returning success message if no error
    return { message: "Message Deleted successfully" };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
export default deleteMessage;

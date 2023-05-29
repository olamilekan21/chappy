import type { Friends, FriendsRequest, users } from "@prisma/client";
import userTransform from "./userTransform";

interface Args {
  users: Omit<users, "password">[];
  requests: FriendsRequest[];
  friends: Friends[];
}

export interface SearchUser extends Omit<users, "password"> {
  type?: "sent" | "received";
  isFriend?: boolean;
  chatId?: string;
}

const transformSearchUsers = (args: Args): SearchUser[] => {
  const { friends, requests, users } = args;

  // creating an empty array of search users
  let newUsers: SearchUser[] = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    // checking if the user is a friend
    const friend = friends.find((friend) => friend.friendId === user.id);

    // checking if the user sent or received a friend request
    const request = requests.find((request) => request.uid === user.id);

    // pushing transformed user if user is a friend
    if (friend)
      newUsers.push({ ...user, isFriend: true, chatId: friend.chatId });

    // pushing transformed user if user sent or received a friend request
    if (request) newUsers.push({ ...user, type: request.type });

    // pushing user if is not a friend or is not a friend request
    if (!friend && !request) newUsers.push(user);
  }

  // returning a list of transformed users
  return newUsers.map((user) => userTransform<SearchUser>(user));
};

export default transformSearchUsers;

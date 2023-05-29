import { gql } from "@apollo/client";
import React from "react";

type Props = {};

const ChatsQuery = gql`
  query Chats($input: ChatsInput) {
    chats(input: $input) {
      totalItems
      results {
        createdAt
        id
        name
        image
        type
        visibility
        updatedAt
        blocked
        pinned
        archive
        description
        user {
          uid
          photoURL
          name
          email
          displayName
          birthday
          bio
          gender
        }
        users {
          admin
          uid
        }
        disabled
        messages {
          id
          senderId
          receiverId
          type
          captionRef
          message
          gifs
          sticker
          reactions {
            reaction
            userIds
          }
          media {
            url
            type
          }
          seen
          createdAt
        }
      }
    }
  }
`;


const UsersCard = (props: Props) => {
  return <div>UsersCard</div>;
};

export default UsersCard;

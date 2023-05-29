import { login } from "@/redux/features/userSlice";
import { gql, useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";

export const UserQuery = gql`
  query User($uid: ID) {
    user(uid: $uid) {
      uid
      email
      name
      displayName
      photoURL
      bio
      gender
      birthday
      createdAt
    }
  }
`;

const useUser = (fetchPolicy: boolean = false) => {
  const dispatch = useDispatch();
  const [getUser, others] = useLazyQuery(UserQuery, {
    fetchPolicy: fetchPolicy ? "network-only" : "cache-first",
    onCompleted: (data) => {
      console.log(data)
      dispatch(login(data.user));
    },
    onError: (err) => console.table(err),
  });

  return { getUser, ...others };
};
export default useUser;

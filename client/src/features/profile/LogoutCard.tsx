import PopupTemplate from "@/components/PopupTemplate";
import { gql, useMutation } from "@apollo/client";
import { Button } from "antd";
import { Logout } from "iconsax-react";
import { signOut } from "next-auth/react";
import React from "react";


const LogoutMutation = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;


type Props = {
  onClose(): void;
};

const LogoutCard = (props: Props) => {
  const { onClose } = props;
  const [logout] = useMutation(LogoutMutation);

  const handleLogout = async () => {
    await logout({
      onCompleted: (data, clientOptions) => {
        signOut({ redirect: false });
      },
      onError: (err) => console.table(err),
    });

    onClose();
  };
  return (
    <PopupTemplate onOutsideClick={onClose}>
      <div className="flex items-center p-2">
        <div className="h-[35px] w-[35px] rounded-full bg-orange-400 flex items-center justify-center">
          <Logout className="text-white" />
        </div>

        <p className="ml-2">Are you sure you want to logout?</p>
      </div>

      <div className="flex items-center justify-end space-x-2 mr-2">
        <Button
          type="text"
          className="border-slate-100 dark:border-neutral-800 text-black dark:text-white hover:text-black/80 hover:dark:text-white/80"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="primary" className="bg-primary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </PopupTemplate>
  );
};

export default LogoutCard;

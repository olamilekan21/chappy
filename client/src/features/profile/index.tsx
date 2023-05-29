import Avatar from "@/components/Avatar";
import IconButton from "@/components/IconButton";
import MenuButton from "@/components/MenuButton";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { handleClose, handleOpen } from "@/redux/features/popupSlice";
import constant from "@/utils/constant";
import { useTheme } from "@/utils/theme";
import { useMutation } from "@apollo/client";
import { cx } from "class-variance-authority";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  Colorfilter,
  Edit2,
  Heart,
  Logout,
  Paintbucket,
  Sms,
  Text,
} from "iconsax-react";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "usehooks-ts";
import ChatColorCard from "./ChatColorCard";
import InviteCard from "./InviteCard";
import MessageFontSize from "./MessageFontSize";
import ThemeCard from "./ThemeCard";
import LogoutCard from "./LogoutCard";


type SettingType = {
  fontSize: 14 | 16 | 18 | 20;
  color: string;
};

const Profile = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { data } = useSession();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState({
    theme: false,
    chatColor: false,
    size: false,
    invite: false,
    logout: false,
  });

  const onClose = () => dispatch(handleClose());
  useOnClickOutside(ref, () => {
    const canClose = Object.values(isModalOpen).every(
      (value) => value === false
    );

    if (canClose) {
      onClose();
    }
  });

  const [setting, setSetting] = useLocalStorage<SettingType>("setting", {
    fontSize: constant.size as any,
    color: constant.primary,
  });

  const user = data?.user;

  const info = {
    Name: user?.name,
    Email: user?.email,
    Gender: user?.gender,
    Birthday:
      user?.birthday != null
        ? dayjs(user.birthday!).format("MMMM d, YYYY")
        : "none",
    "Joined at":
      user?.createdAt != null
        ? dayjs(user.createdAt!).format("MMMM d, YYYY")
        : "none",
  };

  const closeModal = () =>
    setIsModalOpen({
      theme: false,
      chatColor: false,
      size: false,
      invite: false,
      logout: false,
    });

  const handleLogout = () => {
    // logout({
    //   onCompleted: (data, clientOptions) => {
    //     signOut({ redirect: false });
    //   },
    //   onError: (err) => console.table(err),
    // });
    closeModal();
  };
  return (
    <>
      <motion.div
        ref={ref}
        className={cx(
          "overflow-hidden h-screen border-r-[2px] border-slate-100 dark:border-neutral-800 w-full lg:w-[320px] xl:w-[25%] overflow-y-scroll"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <TitleCard
          onClose={onClose}
          onEditClick={() => dispatch(handleOpen({ type: "edit-profile" }))}
        />

        <div className="flex flex-col items-center justify-center mt-2">
          <Avatar
            src={user?.photoURL}
            alt={user?.displayName! ?? user?.name!}
            size={100}
            className="text-lg"
            style={{
              fontSize: "3rem",
            }}
          />

          <p className="text-xl mt-1 text-gray-900 dark:text-gray-100">
            {user?.displayName}
          </p>

          <div className="flex items-center">
            <div className="w-[10px] h-[10px] rounded-lg bg-green-500 mr-0.5"></div>{" "}
            <p className="text-sm text-gray-900 dark:text-gray-100">Online</p>
          </div>

          {user?.bio && (
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center mx-2">
              {user?.bio}
            </p>
          )}
        </div>

        <div className="my-2">
          {Object.entries(info).map(([key, value], index) => value && (
            <div key={index} className="p-2 py-1">
              <p className="text-gray-900 dark:text-gray-100">{key}</p>
              <p className="text-gray-600 dark:text-gray-400">{value}</p>
            </div>
          ))}
        </div>

        <div className="h-[1px] bg-slate-100 dark:bg-neutral-800 mx-2" />

        <div className="my-3">
          <MenuButton
            title="Theme"
            leading={<Colorfilter className="text-black dark:text-white" />}
            trailing={
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                {getTheme(theme!)}
              </p>
            }
            onClick={() => setIsModalOpen({ ...isModalOpen, theme: true })}
          />

          <MenuButton
            title="Chat color"
            leading={<Paintbucket className="text-black dark:text-white" />}
            trailing={
              <div
                className="h-[10px] w-[10px] rounded-full"
                style={{ backgroundColor: setting.color }}
              ></div>
            }
            onClick={() => setIsModalOpen({ ...isModalOpen, chatColor: true })}
          />
          <MenuButton
            title="Message font size"
            leading={<Text className="text-black dark:text-white" />}
            trailing={
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                {getSize(setting.fontSize)}
              </p>
            }
            onClick={() => setIsModalOpen({ ...isModalOpen, size: true })}
          />
        </div>

        <div className="h-[1px] bg-slate-100 dark:bg-neutral-800 mx-2" />

        <div className="my-3">
          <MenuButton
            title="Donate to Chappy"
            leading={<Heart className="text-black dark:text-white" />}
          />
          <MenuButton
            title="Invite your friends"
            leading={<Sms className="text-black dark:text-white" />}
            onClick={() => setIsModalOpen({ ...isModalOpen, invite: true })}
          />
          <MenuButton
            title="Logout"
            leading={<Logout className="text-black dark:text-white" />}
            onClick={() => setIsModalOpen({ ...isModalOpen, logout: true })}
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen.theme && (
          <ThemeCard
            theme={theme!}
            changeTheme={setTheme}
            onClose={closeModal}
          />
        )}
        {isModalOpen.size && (
          <MessageFontSize
            size={setting.fontSize}
            onClose={closeModal}
            changeSize={(fontSize: SettingType["fontSize"]) =>
              setSetting({ ...setting, fontSize })
            }
          />
        )}
        {isModalOpen.chatColor && (
          <ChatColorCard
            onClose={closeModal}
            color={setting.color}
            changeColor={(color) => setSetting({ ...setting, color })}
          />
        )}
        {isModalOpen.invite && <InviteCard onClose={closeModal} />}
        {isModalOpen.logout && (
          <LogoutCard onClose={closeModal} />
        )}
      </AnimatePresence>
    </>
  );
};

interface TitleCardProps {
  onClose(): void;
  onEditClick?(): void;
  title?: string;
  showEditButton?: boolean;
}

export const TitleCard = (props: TitleCardProps) => {
  const {
    onClose,
    onEditClick,
    title = "Profile",
    showEditButton = true,
  } = props;

  return (
    <div className="flex items-center justify-between py-[8px] w-full sticky top-0 z-10 h-[52px] border-b-[2px] border-slate-100 dark:border-neutral-800 bg-white dark:bg-dark">
      <div className="flex items-center">
        <IconButton className="mx-1" onClick={onClose}>
          <IoClose size={25} />
        </IconButton>

        <p className="font-medium text-xl text-black dark:text-white">
          {title}
        </p>
      </div>

      {showEditButton && (
        <IconButton className="mr-1" onClick={onEditClick}>
          <Edit2
            size={25}
            className="text-black dark:text-white group-hover:scale-105 group-active:95"
          />
        </IconButton>
      )}
    </div>
  );
};

const getSize = (size: 14 | 16 | 18 | 20) => {
  switch (size) {
    case 14:
      return "Small";
    case 16:
      return "Normal";
    case 18:
      return "Large";
    case 20:
      return "Extra Large";
    default:
      return "Normal";
  }
};

const getTheme = (theme: string) => {
  switch (theme) {
    case "dark":
      return "Dark";
    case "light":
      return "Light";
    default:
      return "System";
  }
};

export default Profile;

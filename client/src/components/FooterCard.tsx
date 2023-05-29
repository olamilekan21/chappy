import {
  handleClose,
  handleOpen,
  selectPopup,
} from "@/redux/features/popupSlice";
import { useTheme } from "@/utils/theme";
import { cx } from "class-variance-authority";
import { Moon, Sun1 } from "iconsax-react";
import { useSession } from "next-auth/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";

type Props = {};

const FooterCard = (props: Props) => {
  const { data } = useSession();
  const dispatch = useDispatch();
  const popupState = useSelector(selectPopup);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isProfile = popupState.type === "profile";

  const isDarkMode = currentTheme === "dark";

  return (
    <div className="mb-[10px] w-full flex items-center flex-col">
      {/* theme toggle */}
      <div className="flex items-center justify-between bg-slate-100 dark:bg-neutral-800 rounded-full cursor-pointer relative flex-col w-[35px] h-[70px] overflow-hidden group">
        <div className="relative h-full w-full flex flex-col items-center justify-between">
          <button
            className="relative z-[1] flex flex-1 items-center text-sm  rounded-full text-black dark:text-white font-roboto-medium justify-center h-[45%]"
            onClick={() => setTheme("light")}
          >
            <Sun1
              variant="Bulk"
              size={18}
              className={cx("text-black dark:text-white")}
            />
          </button>

          <button
            className="font-roboto-medium relative z-[1] flex flex-1 items-center text-sm rounded-full text-black dark:text-white justify-center h-[45%]"
            onClick={() => setTheme("dark")}
          >
            <Moon
              variant="Bulk"
              size={18}
              className={cx("text-black dark:text-white")}
            />
          </button>
        </div>

        <div
          className={cx(
            "h-[30px] w-[90%] rounded-full bg-white dark:bg-dark absolute left-[50%] top-[50%] translate-x-[-50%] shadow",
            isDarkMode ? "translate-y-[8%]" : "translate-y-[-108%]"
          )}
        ></div>
      </div>

      {/*  User Avatar */}

      <Avatar
        className="rounded-full w-[35px] h-[35px] mt-2 cursor-pointer click"
        src={data?.user.photoURL}
        alt={data?.user?.displayName! ?? data?.user?.name!}
        onClick={() =>
          dispatch(isProfile ? handleClose() : handleOpen({ type: "profile" }))
        }
      />
    </div>
  );
};

export default FooterCard;

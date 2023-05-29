import LogoutCard from "@/features/profile/LogoutCard";
import { cx } from "class-variance-authority";
import {
  Logout,
  MessageText1,
  Profile2User,
  Video,
} from "iconsax-react";
import { useRouter } from "next/router";
import React, { useState } from "react";


const MenuCard = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const [open, setOpen] = useState(false);

  const items = [
    {
      Icon: MessageText1,
      title: "Messages",
      paths: ["/messages", "/message"],
    },
    {
      Icon: Profile2User,
      title: "Friends",
      paths: [
        "/friends",
        "/friends/request",
        "/friends/suggestions",
        "/friends/search",
      ],
    },
    {
      Icon: Video,
      title: "Meets",
      paths: ["/meets"],
    },
    {
      Icon: Logout,
      title: "Logout",
      paths: null,
      onClick: () => setOpen(true),
    },
  ];

  const match = () => {
    let index = items.findIndex((item) => item.paths?.includes(currentPath));
    return index !== -1 ? `${60 * index}px` : false;
  };

  return (
    <>
      <div className="flex-1 flex mt-4 w-full">
        <div className="relative w-full">
          <div className="relative z-[1] w-full flex items-center justify-center flex-col">
            {items.map(({ Icon, paths, onClick }, index: number) => {
              const active = paths?.includes(currentPath);
              return (
                <div
                  key={index}
                  className="group h-[60px] group z-[1] flex items-center justify-center"
                  onClick={() => {
                    if (paths) router.push(paths[0]);
                    onClick?.();
                  }}
                >
                  <button
                    className={cx(
                      "w-[40px] h-[40px] flex items-center justify-center rounded-md click",
                      !active
                        ? "group-hover:bg-slate-100 dark:group-hover:bg-neutral-800"
                        : ""
                    )}
                  >
                    <Icon
                      size={25}
                      variant="Bulk"
                      className={cx(
                        "shrink-0 click",
                        active
                          ? "text-primary"
                          : "text-neutral-600 dark:text-neutral-300"
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {match() && (
            <div className="absolute top-0 left-0 h-[calc(60px*5)] w-[100%]">
              <div
                className="h-[60px] w-full flex items-center transition-all duration-300 ease-in-out"
                style={{ transform: `translateY(${match()})` }}
              >
                <div className="bg-gradient-to-l from-primary/20 via-indigo-600/0 to-indigo-600/0 h-[70%] w-[100%] rounded-sm"></div>

                <span className="w-[5px] h-[60%] rounded-l-full bg-primary" />
              </div>
            </div>
          )}
        </div>
      </div>

      {open && <LogoutCard onClose={() => setOpen(false)} />}
    </>
  );
};

export default MenuCard;

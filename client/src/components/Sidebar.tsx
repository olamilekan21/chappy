/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import FooterCard from "./FooterCard";
import MenuCard from "./MenuCard";

const Sidebar = () => {

  return (
    <div className="h-full border-r-[2px] border-slate-100 dark:border-neutral-800 relative hidden lg:flex items-center justify-between flex-col w-[60px]">
      <div className="flex items-center justify-center mt-[10px]">
        <Link href="/messages">
          <div className="h-[40px] w-[40px] shrink-0 rounded-full flex items-center justify-center click">
            <img
              src="/logo.png"
              alt=""
              className="w-[90%] h-[90%] object-contain"
            />
          </div>
        </Link>
      </div>

      <MenuCard />

      <FooterCard />
    </div>
  );
};

export default Sidebar;

import { cx } from "class-variance-authority";
import { motion } from "framer-motion";
import React from "react";
type Props = {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?(): void;
  layoutId?: string;
};

const MenuButton = (props: Props) => {
  const { title, leading, subtitle, trailing, onClick, layoutId } = props;
  return (
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      className="flex items-center justify-between px-1 py-[8px] hover:bg-slate-100 hover:dark:bg-neutral-800 hover:px-[12px] mx-2 my-1 rounded-lg cursor-pointer hover:scale-105 active:scale-95"
    >
      <div className="flex items-center">
        {leading}

        <div className={cx(leading ? "ml-1" : "")}>
          <p className="text-gray-900 dark:text-gray-100">{title}</p>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {trailing}
    </motion.div>
  );
};
export default MenuButton;

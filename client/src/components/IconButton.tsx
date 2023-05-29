import React, { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
  disableElevation?: boolean;
}

const IconButton = (props: Props) => {
  const {
    className,
    children,
    type = "button",
    size = 35,
    disableElevation = false,
    style,
    ...other
  } = props;
  return (
    <button
      type={type}
      className={twMerge(
        "group flex items-center justify-center rounded-full disabled:scale-100 shrink-0 m-2",
        !disableElevation
          ? "hover:scale-105 active:scale-95 hover:bg-slate-100 hover:dark:bg-neutral-800 transition-transform duration-300 ease  "
          : "",
        className
      )}
      {...other}
      style={{
        width: size + "px",
        height: size + "px",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export default IconButton;

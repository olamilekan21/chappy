import clsx from "clsx";
import React, { ForwardedRef, PropsWithChildren, forwardRef } from "react";

export type CardTemplateProp = {
  title?: string;
  showEditButton?: boolean;
  editTitle?: string;
  onEditClick?(): void;
  className?: string;
  showHeader?: boolean;
  fullWidth?: boolean;
};

const CardTemplate = (
  props: PropsWithChildren<CardTemplateProp>,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const {
    title,
    showEditButton = false,
    showHeader = true,
    fullWidth = false,
    onEditClick,
    children,
    className,
    editTitle,
  } = props;
  return (
    <div
      ref={ref}
      className={clsx(
        "md:w-[100%] rounded-lg dark:bg-dark border border-slate-100 dark:border-neutral-800 bg-white shadow-md dark:shadow-black/40 overflow-hidden pb-2 z-10",
        fullWidth ? "w-full" : "w-[95%]",
        className
      )}
    >
      {title && showHeader && (
        <div className="w-full border-b-[1px] border-b-slate-100 dark:border-b-neutral-800 flex items-center justify-between">
          <p className="py-[8px] pl-[15px] text-lg text-black font-medium dark:text-white">
            {title}
          </p>

          {showEditButton && (
            <button
              className={`px-3 mx-2 font-medium rounded-full py-[4px] text-green-600 bg-green-600/10 transition-all hover:scale-105 active:scale-95`}
              onClick={() => onEditClick?.()}
            >
              {editTitle ?? "Edit"}
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  );
};
CardTemplate.displayName = "CardTemplate";
export default forwardRef(CardTemplate);

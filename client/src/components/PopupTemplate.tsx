import useOnClickOutside from "@/hooks/useOnClickOutside";
import clsx from "clsx";
import { motion } from "framer-motion";
import { PropsWithChildren, useRef } from "react";
import CardTemplate, { CardTemplateProp } from "./CardTemplate";

export interface PopupTemplateProps extends CardTemplateProp {
  title?: string;
  className?: string;
  containerClassName?: string;
  showEditButton?: boolean;
  position?: "left" | "right" | "center" | "top" | "bottom";
  onOutsideClick?: () => void;
  onEditClick?: (value?: any) => void;
  layoutId?: string;
}

const PopupTemplate = (props: PropsWithChildren<PopupTemplateProps>) => {
  const {
    title,
    className,
    children,
    showEditButton = false,
    onEditClick,
    onOutsideClick,
    containerClassName,
    position = "center",
    editTitle,
    showHeader = title ? !!title : false,
    layoutId,
  } = props;
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => onOutsideClick?.());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 w-full h-full bg-black/40 grid place-items-center z-20"
    >
      <motion.div
        ref={ref}
        layoutId={layoutId}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.12 }}
        className={clsx(
          "w-[90%] md:w-[320px] bg-white dark:bg-dark rounded-lg shadow overflow-hidden",
          position === "center" ? "" : "",
          position === "left" ? "md:mr-auto mx-auto md:mx-0 md:ml-8" : "",
          position === "right" ? "mx-auto md:mx-0 md:ml-auto md:mr-8" : "",
          position === "top" ? "my-auto md:my-0 md:mb-auto md:mt-8" : "",
          position === "bottom" ? "my-auto md:my-0 md:mt-auto md:mb-8" : "",
          containerClassName
        )}
      >
        <CardTemplate
          showHeader={showHeader}
          showEditButton={showEditButton}
          title={title}
          className={clsx("w-full md:w-full", className)}
          editTitle={editTitle}
          onEditClick={onEditClick}
          fullWidth
        >
          {children}
        </CardTemplate>
      </motion.div>
    </motion.div>
  );
};

export default PopupTemplate;

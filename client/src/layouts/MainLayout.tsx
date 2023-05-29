import Sidebar from "@/components/Sidebar";
import Profile from "@/features/profile";
import EditProfile from "@/features/profile/EditProfile";
import { selectPopup } from "@/redux/features/popupSlice";
import constant from "@/utils/constant";
import { cx } from "class-variance-authority";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

type Props = {
  rightComponent?: React.ReactNode;
};

const MainLayout = (props: React.PropsWithChildren<Props>) => {
  const { rightComponent, children } = props;
  const router = useRouter();
  const popupState = useSelector(selectPopup);

  const currentPath = router.pathname;

  const isValidPath = constant.authenticatedPath.find(
    (item) => item === currentPath
  );

  const renderCard = () => {
    switch (popupState.type) {
      case "profile":
        return <Profile />;
      case "edit-profile":
        return <EditProfile />;
      default:
        return rightComponent;
    }
  };
  return (
    <div
      className={cx(
        "mx-auto w-full max-w-7xl md:h-screen overflow-hidden bg-white dark:bg-dark flex flex-col md:flex-row",
        isValidPath ? "h-[calc(100vh-50px)]" : "h-screen"
      )}
    >
      <Sidebar />
      <main
        className={cx(
          "md:h-screen w-full lg:w-[calc(100%-60px)] flex",
          isValidPath ? "h-[calc(100vh-50px)]" : "h-screen"
        )}
      >
        <AnimatePresence>
          {renderCard()}
        </AnimatePresence>

        {children}
      </main>
    </div>
  );
};

export default MainLayout;

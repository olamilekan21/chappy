import UsersCard from "@/features/messages/UsersCard";
import constant from "@/utils/constant";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import MainLayout from "./MainLayout";

type Props = {};

const Layouts = (props: React.PropsWithChildren) => {
  const { children } = props;
  const router = useRouter();
  let key = router.pathname;

  if (constant.unauthenticatedPath.includes(key))
    return <Fragment>{children}</Fragment>;

  const RenderCard = () => {
    if (["/messages", "/message"].includes(key)) {
      return <MainLayout rightComponent={<UsersCard />}>{children}</MainLayout>;
    }

    return <Fragment>{children}</Fragment>;
  };
  return <RenderCard />;
};

export default Layouts;

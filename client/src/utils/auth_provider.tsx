import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, {
  Fragment,
  PropsWithChildren,
  useCallback,
  useEffect,
} from "react";
import constant from "./constant";

type Props = {};

const AuthProvider = (props: PropsWithChildren<Props>) => {
  const { children } = props;

  const { status } = useSession();
  const router = useRouter();

  const handleAuth = useCallback(async () => {
    if (status === "loading") return;

    const isUnauthenticatedPath = constant.unauthenticatedPath.find((path) =>
      path.includes(router.pathname)
    );

    if (status === "unauthenticated" && !isUnauthenticatedPath)
      router.replace("/");

    if (status === "authenticated" && isUnauthenticatedPath)
      router.replace("/messages");
  }, [router, status]);

  useEffect(() => {
    handleAuth();
  }, [handleAuth]);

  return <Fragment>{children}</Fragment>;
};

export default AuthProvider;

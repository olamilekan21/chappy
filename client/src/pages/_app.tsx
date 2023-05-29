import useApollo from "@/hooks/useApollo";
import { wrapper } from "@/redux/store";
import "@/styles/globals.css";
import AntConfigProvider from "@/utils/ant_config_provider";
import AuthProvider from "@/utils/auth_provider";
import { ThemeProvider } from "@/utils/theme";
import { ApolloProvider } from "@apollo/client";
import { ConfigProvider } from "antd";
import { cx } from "class-variance-authority";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import Head from "next/head";
import { Provider } from "react-redux";
import Layouts from "../layouts";

const inter = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const meta = {
  title: "Chappy",
  description: "",
  keywords: "",
};
export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);

  const client = useApollo(props.initialApolloState);
  return (
    <>
      <Head>
        <meta name="title" content={`${meta.title} ${process.env.BASE_URL}`} />
      </Head>

      <SessionProvider session={props.pageProps.session}>
        <ApolloProvider client={client}>
          <ThemeProvider
            enableSystem={true}
            attribute="class"
            storageKey="chappy-theme"
            defaultTheme="light"
          >
            <AntConfigProvider>
              <Provider store={store}>
                <AuthProvider>
                  <main
                    className={cx(
                      inter.className,
                      "flex flex-col justify-center"
                    )}
                  >
                    <Layouts>
                      <Component {...props.pageProps} />
                    </Layouts>
                  </main>
                </AuthProvider>
              </Provider>
            </AntConfigProvider>
          </ThemeProvider>
        </ApolloProvider>
      </SessionProvider>
    </>
  );
}

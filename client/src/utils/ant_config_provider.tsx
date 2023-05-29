import { ConfigProvider, theme } from "antd";
import React from "react";
import { useTheme } from "./theme";

const { defaultAlgorithm, darkAlgorithm } = theme;

const AntConfigProvider = ({ children }: React.PropsWithChildren) => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const isDarkMode = currentTheme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: "#6c45c0",
          colorPrimaryText: "#ffffff",
          colorText: isDarkMode ? "#ffffff" : "#333333",
          lineWidth: 1,
          colorBgContainer: isDarkMode ? "#16161d" : "#ffffff",
          colorBgElevated: isDarkMode ? "#16161d" : "#ffffff",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntConfigProvider;

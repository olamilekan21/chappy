import constant from "@/utils/constant";
import { Avatar as Ava, type AvatarProps } from "antd";
import React, { useMemo } from "react";

interface Color {
  id: string;
  bg: string;
  text: string;
}

let selectedColors: Color[] = [];

const Avatar = (props: React.PropsWithChildren<AvatarProps>) => {
  const { children, alt, style, ...rest } = props;

  const colors = constant.avatarColors;

  const getText = () => {
    if (!alt) return "";

    const textArray = alt.split(" ");
    if (textArray.length === 1) return alt.substring(0, 2);
    else return `${textArray[0].charAt(0)}${textArray[1].charAt(0)}`;
  };

  const text = getText();

  const getNextNum = () => {
    if (selectedColors.length === 0) return 0;

    const lastInx = colors.findIndex(
      (c) => c.text === selectedColors[selectedColors.length - 1].text
    );

    if (lastInx === colors.length - 1) return 0;

    return lastInx + 1;
  };

  const color = useMemo(() => {
    const inx = selectedColors.findIndex((c) => c.id === text);

    if (inx !== -1) return selectedColors[inx];

    let color = colors[getNextNum()];

    selectedColors.push({ id: text, ...color });

    return color;
  }, [colors]);

  return (
    <Ava
      style={{
        backgroundColor: color.bg,
        color: color.text,
        fontSize: "1.5rem",
        ...style,
      }}
      {...rest}
    >
      {text}
    </Ava>
  );
};

export default Avatar;

import PopupTemplate from "@/components/PopupTemplate";
import { useTheme } from "@/utils/theme";
import { Radio, type RadioChangeEvent } from "antd";
import React from "react";

type Props = {
  onClose(): void;
  layoutId?: string
  changeTheme(value: string): void;
  theme: string;
};

const ThemeCard = (props: Props) => {
  const { onClose,changeTheme, theme } = props;

  const onChange = (e: RadioChangeEvent) => {
    changeTheme(e.target.value)
    setTimeout(() => onClose(), 300);
  };

  return (
    <PopupTemplate title="Theme" onOutsideClick={onClose}>
      <Radio.Group
        onChange={onChange}
        value={theme}
        size="large"
        buttonStyle="solid"
        className=""
      >
        <div className="p-2 py-0 pt-2 pl-3 flex flex-col">
          <Radio value="system"  className="py-1 text-black dark:text-white text-lg">
            System default
          </Radio>
          <Radio
            value="light"
            className="py-1 text-black dark:text-white bg-transparent text-lg"
          >
            Light
          </Radio>
          <Radio value="dark" className="py-1 text-black dark:text-white text-lg">
            Dark
          </Radio>
        </div>
      </Radio.Group>
    </PopupTemplate>
  );
};

export default ThemeCard;

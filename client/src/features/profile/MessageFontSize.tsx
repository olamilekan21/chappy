import PopupTemplate from "@/components/PopupTemplate";
import { Radio, RadioChangeEvent } from "antd";
import React from "react";

type Props = {
  onClose(): void;
  size: 14 | 16 | 18 | 20;
  changeSize(value: Props["size"]): void;
};

const MessageFontSize = (props: Props) => {
  const { onClose, size,changeSize } = props;

  const onChange = (e: RadioChangeEvent) => {
    changeSize(e.target.value as any)
    setTimeout(() => onClose(), 300);
  };
  return (
    <PopupTemplate title="Message font size" onOutsideClick={onClose}>
      <Radio.Group
        onChange={onChange}
        value={size}
        size="large"
        buttonStyle="solid"
        className=""
      >
        <div className="p-2 py-0 pt-2 pl-3 flex flex-col">
          <Radio value={14} className="py-1 text-black dark:text-white text-lg">
            Small
          </Radio>
          <Radio
            value={16}
            className="py-1 text-black dark:text-white bg-transparent text-lg"
          >
            Normal
          </Radio>
          <Radio value={18} className="py-1 text-black dark:text-white text-lg">
            Large
          </Radio>
          <Radio value={20} className="py-1 text-black dark:text-white text-lg">
            Extra Large
          </Radio>
        </div>
      </Radio.Group>
    </PopupTemplate>
  );
};

export default MessageFontSize;

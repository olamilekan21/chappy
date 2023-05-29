import PopupTemplate from "@/components/PopupTemplate";
import constant from "@/utils/constant";
import { Button } from "antd";
import React from "react";
import { IoCheckmark } from "react-icons/io5";

type Props = {
  onClose(): void;
  color: string;
  changeColor(color: string): void;
};

const ChatColorCard = (props: Props) => {
  const { onClose, changeColor, color: activeColor } = props;
  return (
    <PopupTemplate title="Chat color" onOutsideClick={onClose}>
      <div className="flex flex-wrap items-center justify-self-start justify-center mt-2">
        {constant.recommendedColors.map((color, index) => (
          <div
            key={index}
            className="h-[40px] w-[40px] rounded-full m-1 cursor-pointer hover:scale-110 active:scale-95 flex items-center justify-center"
            style={{ backgroundColor: color }}
            onClick={() => changeColor(color)}
          >
            {activeColor === color && (
              <IoCheckmark size={30} className="text-white" />
            )}
          </div>
        ))}
      </div>

      {/* <div className="flex">
        <Button type="default">Cancel</Button>
        <Button type="primary">Apply</Button>
      </div> */}
    </PopupTemplate>
  );
};

export default ChatColorCard;

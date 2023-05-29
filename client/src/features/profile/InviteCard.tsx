import MenuButton from "@/components/MenuButton";
import PopupTemplate from "@/components/PopupTemplate";
import share from "@/utils/share";
import { Copy, Share } from "iconsax-react";
import React from "react";
import { useCopyToClipboard } from "usehooks-ts";
type Props = {
  onClose(): void;
};

const InviteCard = (props: Props) => {
  const { onClose } = props;

  const [_, copy] = useCopyToClipboard();
  return (
    <PopupTemplate title="Invite friends" onOutsideClick={onClose}>
      <div className="p-2 py-0 pt-2 pl-0">
        <div className="flex flex-col mx-2 p-1 border-[1px] border-slate-100 dark:border-neutral-800 rounded-lg">
          <p className="">
            Let,s switch to chappy <br /> https://chappy.io/install
          </p>

          <button
            className="ml-auto rounded-full hover:bg-slate-100 hover:dark:bg-neutral-800"
            onClick={() =>
              copy("Let,s switch to chappy, https://chappy.io/install")
            }
          >
            <Copy />
          </button>
        </div>
        <MenuButton
          title="Share"
          leading={<Share />}
          onClick={() =>
            share({
              title: "Invite friends",
              text: "Let,s switch to chappy, https://chappy.io/install",
            })
          }
        />
      </div>
    </PopupTemplate>
  );
};

export default InviteCard;

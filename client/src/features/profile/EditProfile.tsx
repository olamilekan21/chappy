import Avatar from "@/components/Avatar";
import { handleOpen } from "@/redux/features/popupSlice";
import { Badge, Button, Form, Input, Segmented } from "antd";
import { motion } from "framer-motion";
import { Edit2 } from "iconsax-react";
import { useSession } from "next-auth/react";
import React, { ChangeEvent, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useOnClickOutside } from "usehooks-ts";
import { TitleCard } from ".";
import toBase64 from "@/utils/toBase64";

const { TextArea } = Input;

export type ImageType = {
  file: File | null;
  url: string | ArrayBuffer;
};


const inputClassNames = {
  input: "py-1.5 bg-slate-100 dark:bg-neutral-800 text-black dark:text-white",
};

const EditProfile = () => {
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { data } = useSession();
  const user = data?.user;

  const [gender, setGender] = useState("None");

  const [image, setImage] = useState<ImageType>({
    file: null,
    url: "",
  });

  const onClose = () => dispatch(handleOpen({ type: "profile" }));

  const onFinish = () => {};
  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = e.target.files;
      const newUrl = await toBase64(fileList[0]);
      setImage({ url: newUrl, file: fileList[0] });
    }
  };

  useOnClickOutside(ref, onClose);

  return (
    <motion.div
      ref={ref}
      className="overflow-hidden h-screen border-r-[2px] border-slate-100 dark:border-neutral-800 w-full lg:w-[320px] xl:w-[25%] overflow-y-scroll"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <TitleCard
        title="Edit Profile"
        onClose={onClose}
        showEditButton={false}
      />

      <div className="flex flex-col items-center justify-center mt-2">
        <div className="relative">
          <Avatar
            src={image.url as any ?? user?.photoURL}
            alt={user?.displayName! ?? user?.name!}
            size={100}
            className="text-lg relative"
            style={{
              fontSize: "3rem",
            }}
          />

          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            multiple={false}
            className="hidden"
            onChange={(e) => onAvatarChange?.(e)}
          />

          <label
            htmlFor="image"
            className="absolute bottom-0 right-0 h-[30px] w-[30px] bg-primary text-white rounded-full flex items-center justify-center click cursor-pointer"
          >
            <Edit2 size={20} />
          </label>
        </div>

        <div className="w-[90%] mt-3">
          <Form
            name="profile-form"
            className="w-full"
            layout="vertical"
            initialValues={{
              layout: "vertical",
              name: user?.name,
              username: user?.displayName,
              bio: user?.bio,
            }}
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label={
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Name
                </label>
              }
              name="name"
            >
              <Input
                id="name"
                type="text"
                autoComplete="name"
                classNames={inputClassNames}
                required
              />
            </Form.Item>

            <Form.Item
              label={
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Username
                </label>
              }
              name="username"
            >
              <Input
                id="username"
                type="text"
                autoComplete="name"
                classNames={inputClassNames}
                value={user?.displayName}
                required
              />
            </Form.Item>

            <Form.Item
              label={
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Gender
                </label>
              }
              name="gender"
            >
              <Segmented
                options={["Male", "Female", "None"]}
                defaultValue={user?.gender === "none" ? "None" : user?.gender!}
                value={gender}
                onChange={(value) => setGender(value.toString())}
                className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
                block
              />
            </Form.Item>

            <Form.Item
              label={
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Bio
                </label>
              }
              name="bio"
            >
              <TextArea
                id="bio"
                classNames={{
                  textarea:
                    "py-1.5 bg-slate-100 dark:bg-neutral-800 text-black dark:text-white",
                }}
                value={user?.bio}
                required
              />
            </Form.Item>

            <Form.Item className="mt-5">
              <Button
                type="primary"
                className="bg-primary text-white w-full text-sm font-semibold leading-6 py-1.5 h-fit"
                htmlType="submit"
                // loading={loading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </motion.div>
  );
};

export default EditProfile;

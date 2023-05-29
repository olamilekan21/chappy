import { Lock, MessageFavorite, People, Send } from "iconsax-react";
import React from "react";

type Props = {};

const items = [
  {
    Icon: MessageFavorite,
    title: "Say Anything",
    message:
      "Share text,voice messages, photos,videos,gifs and files for free.",
  },
  {
    Icon: Lock,
    title: "Security",
    message:
      "End-to-End encryption keeps your messages secure. Communicate freely with absolute privacy.",
  },
  {
    Icon: Send,
    title: "Speak Freely",
    message:
      "Make voice and video calls to people live across the ocean, with no long-distance charges.",
  },
  {
    Icon: People,
    title: "Get Together with Groups",
    message:
      "Group chats make it easy to stay connected to your family, friends, and coworkerd.",
  },
];

const Features = (props: Props) => {
  return (
    <section className="mx-auto flex flex-col items-center justify-center max-w-7xl px-6 lg:px-8 ">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-primary font-semibold">Why chappy</h3>

        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          Some of our features that will help your communication
        </p>

        <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400 text-center">
          Boost communication with seamless device integration, crystal-clear
          audio/video, top-notch security, file sharing, real-time
          collaboration, intuitive interface, and customization options. Elevate
          your experience today!
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {items.map(({ title, message, Icon }, index) => (
            <div key={index} className="relative pl-8">
              <dt className="text-base font-medium leading-7 text-gray-900 dark:text-gray-100">
                <div className="absolute left-0 top-0 flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-primary">
                  <Icon size={20} className="text-white" />
                </div>
                {title}
              </dt>
              <dd className="mt-0 text-base leading-7 text-gray-600 dark:text-gray-400">
                {message}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Features;

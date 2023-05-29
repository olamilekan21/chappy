import items from "@/data/footer_data.json";
import Link from "next/link";
import React from "react";
import {
  FiFacebook,
  FiGithub,
  FiInstagram,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";
import { Logo } from "./Navbar";

const socialItems = [
  {
    name: "Facebook",
    link: "/",
    Icon: FiFacebook,
  },
  {
    name: "Instagram",
    link: "/",
    Icon: FiInstagram,
  },
  {
    name: "Twitter",
    link: "/",
    Icon: FiTwitter,
  },
  {
    name: "Github",
    link: "/",
    Icon: FiGithub,
  },
  {
    name: "Youtube",
    link: "/",
    Icon: FiYoutube,
  },
];

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="py-2 bg-[#111827] px-5 pt-16 mt-8">
      <Logo />

      <ul className="flex flex-col lg:flex-row justify-between pt-5">
        {items.map(({ list, title }, index) => (
          <li key={index} className={index !== 0 ? "pt-2 lg:pt-0" : ""}>
            <p className="font-semibold text-white">{title}</p>

            <ul className="pt-1">
              {list.map((value, i) => (
                <Link key={i} href={value.link}>
                  <li className="text-gray-400 py-1">{value.title}</li>
                </Link>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="h-[0.5px] bg-neutral-700 my-5" />

      <div className="flex flex-col lg:flex-row items-center justify-between">
        <p className="text-gray-400 pb-2">
          © 2020 Your Company, Inc. All rights reserved.
        </p>

        <ul className="flex items-center">
          {socialItems.map(({ Icon, link }, index) => (
            <Link key={index} href={link}>
              <li className="text-gray-400 hover:text-gray-300 h-[35px] w-[35px] flex items-center justify-center mx-1">
                <Icon size={25} />
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;

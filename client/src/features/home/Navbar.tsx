/* eslint-disable @next/next/no-img-element */
import { Button } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { FiArrowRight, FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const items = ["Features", "Reviews", "Contact"];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="top-0 z-[100] absolute w-full max-w-7xl">
      <nav className="mx-2 lg:mx-4 py-2 flex items-center justify-between inset-x-0 ">
        <Logo />

        <ul className="hidden lg:flex items-center space-x-4">
          {items.map((item, index) => (
            <li
              key={index}
              className="text-black dark:text-white font-medium cursor-pointer hover:text-primary"
            >
              {item}
            </li>
          ))}
        </ul>

        <Link href="/auth/signin">
          <Button
            type="text"
            className="text-dark dark:text-white font-medium hidden lg:flex items-center hover:dark:text-white/90"
          >
            Log in <FiArrowRight className="ml-1" />
          </Button>
        </Link>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <FiMenu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-0 w-full h-screen bg-white dark:bg-dark z-[9999]">
          <div className="flex items-center justify-between p-2">
            <Logo />

            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <IoClose className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="">
            <ul className="my-2">
              {items.map((item, index) => (
                <Link key={index} href="#">
                  <li className="py-1 mx-2 my-1 px-2 rounded-lg hover:bg-slate-100 hover:dark:bg-neutral-800 font-medium leading-7 text-black dark:text-white">
                    {item}
                  </li>
                </Link>
              ))}
            </ul>

            <div className="h-[1px] bg-slate-100 dark:bg-neutral-800 mx-2"></div>

            <Link href="/auth/signin">
              <div className="py-1 mx-2 px-2 rounded-lg hover:bg-slate-100 hover:dark:bg-neutral-800 font-medium leading-7 my-2 text-black dark:text-white">
                Log in
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center w-fit">
        <div className="h-[40px] w-[40px] shrink-0 rounded-full flex items-center justify-center ">
          <img
            src="/logo.png"
            alt=""
            className="w-[90%] h-[90%] object-contain"
          />
        </div>
        <p className="text-[1.2rem] mx-1 font-bold font-lato-heavy text-primary">
          Chappy
        </p>
      </div>
    </Link>
  );
};

export default Navbar;

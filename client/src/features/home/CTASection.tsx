/* eslint-disable @next/next/no-img-element */
import { Button } from "antd";
import Link from "next/link";
import React from "react";
import { FiDownload } from "react-icons/fi";

const CTASection = () => {
  return (
    <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8 pb-0 lg:pb-0 lg:pt-8">
      <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
          aria-hidden="true"
        >
          <circle
            cx={512}
            cy={512}
            r={512}
            fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
            fillOpacity="0.7"
          />
          <defs>
            <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
              <stop stopColor="#6c45c0" />
              <stop offset={1} stopColor="#E935C1" />
            </radialGradient>
          </defs>
        </svg>

        <div className="mx-auto max-w-full flex flex-col items-center justify-center lg:mx-0 lg:flex-auto lg:py-12 lg:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
            Boost your communication.
            <br />
            Start using our app today.
          </h2>
          <p className="max-w-xl mt-2 text-lg leading-8 text-gray-300 text-center">
            Ac euismod vel sit maecenas id pellentesque eu sed consectetur.
            Malesuada adipiscing sagittis vel nulla.
          </p>
          <div className="mt-2 pb-8 lg:pb-0 flex items-center justify-center gap-x-6 lg:justify-center">
            <Link href="/auth/signup">
              <Button
                type="primary"
                size="large"
                className="bg-white text-black font-medium"
              >
                Get started
              </Button>
            </Link>

            <Button
              type="ghost"
              size="large"
              className="font-medium flex items-center text-white hover:text-white"
            >
              <FiDownload className="mr-1" /> Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;

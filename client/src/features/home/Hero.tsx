/* eslint-disable @next/next/no-img-element */
import PageGradient from "@/components/PageGradient";
import { Button } from "antd";
import Link from "next/link";
import React from "react";
import { FiDownload } from "react-icons/fi";

const Hero = () => {
  return (
    <PageGradient>
      <div className="mx-auto py-10 pt-0 lg:py-20 flex flex-col lg:flex-row">
        <div className="max-w-2xl space-x-6 mt-5 lg:mt-8">
          <div className="text-start pt-10 pl-5 lg:pl-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
              Connect with friends and family easily.
            </h1>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Chat is a communication application between friends, family and
              team at the same time wrapper in one user-friendly application.
            </p>
            <div className="mt-2 flex items-center space-x-2">
              <Link href="/auth/signup">
                <Button
                  type="primary"
                  size="large"
                  className="bg-primary font-medium"
                >
                  Get started
                </Button>
              </Link>

              <Button
                type="text"
                size="large"
                className="font-medium flex items-center text-gray-700 dark:text-gray-200 hover:dark:text-white/80"
              >
                <FiDownload className="mr-1" /> Download
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-md pl-0 lg:pl-10 mt-3 lg:mt-0">
          <img src="/preview.png" alt="" className="object-contain" />
        </div>
      </div>
    </PageGradient>
  );
};

export default Hero;

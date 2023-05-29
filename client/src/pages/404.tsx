import PageGradient from "@/components/PageGradient";
import { Footer, Navbar } from "@/features/home";
import { Button } from "antd";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <Navbar />

      <PageGradient Component="main">
        <div className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-primary">404</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-400">
              Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div className="mt-3 flex items-center justify-center gap-x-6">
              <Link href="/">
                <Button
                  type="primary"
                  size="large"
                  className="bg-primary font-medium"
                >
                  Go back home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageGradient>

      <Footer />
    </div>
  );
};

export default NotFound;

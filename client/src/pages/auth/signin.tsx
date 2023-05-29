import PageGradient from "@/components/PageGradient";
import { Logo } from "@/features/home/Navbar";
import { Button, Form, Input } from "antd";
import { Eye, EyeSlash } from "iconsax-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

const inputClassNames = {
  input: "py-1.5 bg-slate-100 dark:bg-neutral-800 text-black dark:text-white",
};

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);


  const onFinish = async (fieldsValue: any) => {
    setLoading(true);
    await signIn("signin", {
      email: fieldsValue["email"],
      password: fieldsValue["password"],
      redirect: false,
    });

    setLoading(false);
  };

  return (
    <main className="mx-auto w-full h-screen 2xl:h-full lg:max-w-7xl">
      <PageGradient className="w-full flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex items-center flex-col justify-center">
          <Logo />
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-3 sm:mx-auto w-full lg:max-w-sm ">
          <Form
            name="login-form"
            className="w-full"
            layout="vertical"
            initialValues={{ layout: "vertical" }}
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label={
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Email address
                </label>
              }
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter a valid email",
                  type: "email",
                },
              ]}
            >
              <Input
                id="email"
                type="email"
                autoComplete="email"
                classNames={inputClassNames}
                required
              />
            </Form.Item>

            <Form.Item
              label={
                <div className="flex items-center justify-between w-screen">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <Link
                      href="/auth/forget_password"
                      className="font-semibold text-primary hover:text-primary/90"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
              }
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password",
                  type: "string",
                },
              ]}
              className=""
            >
              <Input
                id="password"
                type={passwordVisible ? "text" : "password"}
                autoComplete="password"
                classNames={inputClassNames}
                required
                addonAfter={
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="w-full h-full"
                  >
                    {passwordVisible ? (
                      <Eye className="text-black dark:text-white" />
                    ) : (
                      <EyeSlash className="text-black dark:text-white" />
                    )}
                  </button>
                }
              />
            </Form.Item>

            <Form.Item className="mt-5">
              <Button
                type="primary"
                className="bg-primary text-white w-full text-sm font-semibold leading-6 py-1.5 h-fit"
                htmlType="submit"
                loading={loading}
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>

          <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-300">
            Not a member?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold leading-6 text-primary hover:text-primary/90"
            >
              Signup
            </Link>
          </p>
        </div>
      </PageGradient>
    </main>
  );
};

export default SignIn;

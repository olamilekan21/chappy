import PageGradient from "@/components/PageGradient";
import { Logo } from "@/features/home/Navbar";
import { Button, Form, Input } from "antd";
import { Eye, EyeSlash } from "iconsax-react";
import React, { useState } from "react";

const inputClassNames = {
  input: "py-1.5 bg-slate-100 dark:bg-neutral-800 text-black dark:text-white",
};

const ChangePassword = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onFinish = async (fieldsValue: any) => {};
  return (
    <div className="mx-auto w-full h-screen 2xl:h-full lg:max-w-7xl">
      <PageGradient className="w-full flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex items-center flex-col justify-center">
          <Logo />
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            Create New Password
          </h2>
        </div>

        <div className="mt-3 sm:mx-auto w-full lg:max-w-sm ">
          <Form
            name="password-form"
            className="w-full"
            layout="vertical"
            initialValues={{ layout: "vertical" }}
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label={
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Password
                </label>
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

            <Form.Item
              label={
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Confirm Password
                </label>
              }
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your password",
                  type: "string",
                },
              ]}
              className=""
            >
              {/* <Input
                id="confirmPassword"
                type="confirmPassword"
                autoComplete="password"
                classNames={inputClassNames}
                required
              /> */}

              <Input
                id="confirmPassword"
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
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </PageGradient>
    </div>
  );
};

export default ChangePassword;

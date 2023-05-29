import PageGradient from "@/components/PageGradient";
import { Logo } from "@/features/home/Navbar";
import { forget } from "@/redux/features/userSlice";
import { Button, Form, Input, message } from "antd";
import request, { gql } from "graphql-request";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useDispatch } from "react-redux";

const inputClassNames = { input: "py-1.5 bg-slate-100 dark:bg-neutral-800 text-black dark:text-white" };
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const ForgetMutation = gql`
  mutation ForgetPassword($email: String!) {
    forgetPassword(email: $email) {
      message
    }
  }
`;

const CodeMutation = gql`
  mutation ValidateCode($input: ValidateCodeInput!) {
    validateCode(input: $input) {
      validate
    }
  }
`;

const serverUrl = process.env.SERVER_URL!;

const ForgetPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [form, setForm] = useState({
    otp: "",
    email: "",
  });
  const isEmail = form.email.match(emailRegex);
  const onFinish = async (fieldsValue: any) => {
    setLoading(true);

    await request(serverUrl, CodeMutation, {
      input: { email: form.email, token: form.otp },
    }).then((response: any) => {
      if (response.validateCode.validate) {
        router.push("/auth/change_password");
        dispatch(forget({ email: form.email, token: form.otp }));
      } else {
        messageApi.open({
          type: "error",
          content: "Verification failed",
        });
      }
    });

    setLoading(false);
  };

  const getCode = async () => {
    setIsCodeSent(false);
    await request(serverUrl, ForgetMutation, {
      input: { email: form.email },
    });

    setIsCodeSent(true);
  };

  return (
    <div className="mx-auto w-full h-screen 2xl:h-full lg:max-w-7xl">
      <PageGradient className="w-full flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex items-center flex-col justify-center">
          <Logo />
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            Forget your password
          </h2>
        </div>

        <div className="mt-3 sm:mx-auto w-full lg:max-w-sm ">
          <Form
            name="forgetpassword-form"
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
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                    Verification code
                  </label>
                  <div className="text-sm">
                    <button
                      type="button"
                      className="font-semibold text-primary hover:text-primary/90"
                      disabled={!isEmail}
                      onClick={getCode}
                    >
                      Get code
                    </button>
                  </div>
                </div>
              }
              name="code"
            >
              <OtpInput
                inputStyle={{
                  width: "3rem",
                  height: "3rem",
                  fontSize: "1.5rem",
                }}
                containerStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                value={form.otp}
                onChange={(value) => setForm({ ...form, email: value })}
                numInputs={4}
                inputType="tel"
                renderInput={(props: any) => (
                  <Input
                    {...props}
                    className="w-[40px] h-[40px]"
                    classNames={inputClassNames}
                    disabled={!isEmail}
                    readOnly={!isEmail}
                  />
                )}
              />
            </Form.Item>

            <Form.Item className="mt-5">
              <Button
                type="primary"
                className="bg-primary text-white w-full text-sm font-semibold leading-6 py-1.5 h-fit"
                htmlType="submit"
                loading={loading}
              >
                Continue
              </Button>
            </Form.Item>

            <Form.Item className="">
              <Link href="/auth/signin">
                <Button
                  type="link"
                  className="w-full text-sm font-semibold leading-6 py-1.5 h-fit"
                  htmlType="button"
                >
                  Return to signin
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </PageGradient>
    </div>
  );
};

export default ForgetPassword;

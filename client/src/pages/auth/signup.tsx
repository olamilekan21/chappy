import { Logo } from "@/features/home/Navbar";
import { Button, Calendar, Form, Input, theme } from "antd";
import type { Dayjs } from "dayjs";
import Link from "next/link";
import React, { useState } from "react";
import DatePicker, {
  CalendarContainer,
  CalendarContainerProps,
} from "react-datepicker";

import { Calendar as CalendarIcon, Eye, EyeSlash } from "iconsax-react";

import PageGradient from "@/components/PageGradient";
import { signIn } from "next-auth/react";
import "react-datepicker/dist/react-datepicker.css";

const inputClassNames = {
  input: "py-1.5 bg-slate-100 dark:bg-neutral-800 text-black dark:text-white",
};

const Register = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onFinish = async (fieldsValue: any) => {
    if (date == null) return;

    setLoading(true);
    await signIn("signup", {
      email: fieldsValue["email"],
      displayName: fieldsValue["displayName"],
      birthday: new Date(date.format()),
      password: fieldsValue["password"],
      redirect: false,
    });

    setLoading(false);
  };

  const CustomCalender = ({}: CalendarContainerProps) => {
    const { token } = theme.useToken();
    const wrapperStyle: React.CSSProperties = {
      width: 300,
      border: `1px solid ${token.colorBorderSecondary}`,
      borderRadius: token.borderRadiusLG,
    };
    return (
      <div style={wrapperStyle}>
        <CalendarContainer>
          <Calendar
            fullscreen={false}
            onChange={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </CalendarContainer>
      </div>
    );
  };

  const CustomInput = () => {
    const day = date && date.format("YYYY-MM-DD");
    return (
      <Input
        classNames={inputClassNames}
        readOnly
        onClick={() => setOpen(true)}
        required
        value={day!}
        addonAfter={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full h-full"
          >
            <CalendarIcon />
          </button>
        }
      />
    );
  };

  return (
    <main className="mx-auto w-full h-screen 2xl:h-full lg:max-w-7xl">
      <PageGradient className="w-full flex flex-col items-center justify-center px-6 py-12 lg:px-8 border-1 border-gray-300">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex items-center flex-col justify-center">
          <Logo />
          <h2 className="mt-2 text-center text-2xl font-medium leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            Create new account
          </h2>
        </div>

        <div className="mt-3 sm:mx-auto w-full lg:max-w-sm ">
          <Form
            name="register-form"
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
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Username
                </label>
              }
              name="displayName"
              rules={[
                {
                  required: true,
                  message: "Please enter your username",
                  type: "string",
                },
              ]}
            >
              <Input
                id="displayName"
                type="text"
                autoComplete="text"
                classNames={inputClassNames}
                required
              />
            </Form.Item>

            <Form.Item
              label={
                <label
                  htmlFor="date-of-birth"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Date of birth
                </label>
              }
              name="date-of-birth"
            >
              <DatePicker
                id="date-of-birth"
                onChange={(date) => {}}
                value={date?.format("YYYY-MM-DD")}
                required
                customInput={<CustomInput />}
                open={open}
                onCalendarOpen={() => setOpen(true)}
                onCalendarClose={() => setOpen(false)}
                onClickOutside={() => setOpen(false)}
                calendarContainer={CustomCalender}
                // readOnly={true}
              />
            </Form.Item>

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

              {/* <Input.Password
                id="password"
                type="password"
                autoComplete="password"
                classNames={{
                  input: "text-black dark:text-white py-1.5",
                }}
                className="bg-white dark:bg-neutral-800 text-black dark:text-white py-1.5"
                iconRender={(visible) => (
                  <button>
                    {visible ? (
                      <Eye className="text-black dark:text-white" />
                    ) : (
                      <EyeSlash className="text-black dark:text-white" />
                    )}
                  </button>
                )}
                required
              /> */}
            </Form.Item>

            <Form.Item className="mt-5">
              <Button
                type="primary"
                className="bg-primary text-white w-full text-sm font-semibold leading-6 py-1.5 h-fit"
                htmlType="submit"
                loading={loading}
              >
                Sign up
              </Button>
            </Form.Item>
          </Form>

          <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-300">
            Already a member?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold leading-6 text-primary hover:text-primary/90"
            >
              Sign in
            </Link>
          </p>
        </div>
      </PageGradient>
    </main>
  );
};

export default Register;

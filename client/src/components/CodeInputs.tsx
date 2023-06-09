import usePrevious from "@/hooks/usePrevious";
import { Input } from "antd";
import clsx from "clsx";
import React, {
  ChangeEvent,
  ClipboardEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  createRef,
  useEffect,
  useState,
} from "react";

let numInputs = 5,
  isInputNum: boolean;

const inputClassNames = {
  input: "py-1.5",
};

interface CodeInputsProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  readOnly?: boolean;
}

const CodeInputs = (props: CodeInputsProps) => {
  const {
    className,
    onChange,
    value = "",
    isDisabled = false,
    readOnly = false,
  } = props;

  const [input, setInput] = useState(value);
  const [state, setState] = useState({
    activeInput: 0,
    isDisabled,
    shouldAutoFocus: false,
    isInputSecure: false,
  });

  const getOtpValue = () => (input ? input.toString().split("") : []);

  const handleOtpChange = (otp: number[] | string[]) => {
    const otpValue = otp.join("");
    setInput(otpValue);
    onChange?.(otpValue);
  };

  const focusInput = (value: number) => {
    const activeInput = Math.max(Math.min(numInputs - 1, value), 0);

    setState({ ...state, activeInput });
  };

  const focusNextInput = () => {
    focusInput(state.activeInput + 1);
  };

  const focusPrevInput = () => {
    focusInput(state.activeInput - 1);
  };

  const changeCodeAtFocus = (value: any) => {
    let otp = getOtpValue();
    otp[state.activeInput] = value[0];
    handleOtpChange(otp);
  };

  const handleOnPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { activeInput } = state;

    if (state.isDisabled) {
      return;
    }

    const otp = getOtpValue();

    let nextActiveInput = activeInput;
    const pastedData = (
      e.clipboardData
        .getData("text/plain")
        .slice(0, numInputs - state.activeInput) as any
    ).split("");

    for (let pos = 0; pos < numInputs; ++pos) {
      if (pos >= activeInput && pastedData.length > 0) {
        otp[pos] = pastedData.shift();
        nextActiveInput++;
      }
    }

    setState({ ...state, activeInput: nextActiveInput });
    focusInput(nextActiveInput);
    handleOtpChange(otp);
  };

  const isInputValueValid = (value: string) => {
    const isTypeValid = isInputNum
      ? !isNaN(parseInt(value, 10))
      : typeof value === "string";

    return isTypeValid && value.trim().length === 1;
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (isInputValueValid(value)) {
      changeCodeAtFocus(value);
    }
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      changeCodeAtFocus("");
      focusPrevInput();
    } else if (e.key === "Delete") {
      e.preventDefault();
      changeCodeAtFocus("");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusPrevInput();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusNextInput();
    } else if (e.key === " " || e.key === "Spacebar" || e.key === "Space") {
      e.preventDefault();
    }
  };

  const handleOnInput = (e: any) => {
    if (isInputValueValid(e.target.value)) {
      focusNextInput();
    } else {
      if (isInputNum) {
        const { nativeEvent } = e;

        if (
          nativeEvent.data === null &&
          nativeEvent.inputType === "deleteContentBackward"
        ) {
          e.preventDefault();
          changeCodeAtFocus("");
          focusPrevInput();
        }
      }
    }
  };

  return (
    <div
      className={clsx("w-[98%] flex items-center justify-between", className)}
    >
      {Array(5)
        .fill(1)
        .map((_, i: number) => {
          const otp = getOtpValue() as any;
          return (
            <CodeInput
              key={i}
              index={i}
              readOnly={readOnly}
              focus={!isDisabled && state.activeInput === i}
              value={otp[i]}
              onChange={handleOnChange}
              onKeyDown={handleOnKeyDown}
              onInput={handleOnInput}
              onPaste={handleOnPaste}
              onFocus={(e) => {
                setState({ ...state, activeInput: i });
                e.target.select();
              }}
              onBlur={() => setState({ ...state, activeInput: -1 })}
              shouldAutoFocus={state.shouldAutoFocus}
              isInputNum={isInputNum}
            />
          );
        })}
    </div>
  );
};

interface CodeInputType
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  focus: boolean;
  shouldAutoFocus: boolean;
  isInputNum: boolean;
  index: number;
  value: any;
}

const CodeInput = ({
  focus,
  shouldAutoFocus,
  index,
  isInputNum,
  value,
  ...others
}: CodeInputType) => {
  const inputRef = createRef<HTMLInputElement>();

  const prevFocus = usePrevious(focus);
  const prevValue = usePrevious(value);

  useEffect(() => {
    if (inputRef.current && focus && shouldAutoFocus) {
      inputRef.current.focus();
    }
  }, [focus, inputRef, shouldAutoFocus]);

  useEffect(() => {
    const inputEl = inputRef.current;
    if (prevFocus !== focus && inputEl && focus) {
      inputEl.focus();
      inputEl.select();
    }
  }, [focus, inputRef, prevFocus]);

  useEffect(() => {
    if (inputRef.current && prevValue !== value) {
      inputRef.current.value = value ?? "";
    }
  }, [value, inputRef, prevValue]);
  return (
    <Input
      {...others}
      classNames={inputClassNames}
      className="w-[40px] h-[40px]"
      ref={inputRef as any}
      autoComplete="off"
      maxLength={1}
      value={value}
      type="tel"
    />
  );
};

export default CodeInputs;

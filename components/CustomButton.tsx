// *********************
// Role of the component: Custom button component
// Name of the component: CustomButton.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CustomButton paddingX={paddingX} paddingY={paddingY} text={text} buttonType={buttonType} customWidth={customWidth} textSize={textSize} />
// Input parameters: CustomButtonProps interface
// Output: custom button component
// *********************

import React from "react";

interface CustomButtonProps {
  paddingX: number;
  paddingY: number;
  text: string;
  buttonType: "submit" | "reset" | "button";
  customWidth: string;
  textSize: string;
  onClick?: () => void;
  disabled?: boolean;
}

const CustomButton = ({
  paddingX,
  paddingY,
  text,
  buttonType,
  customWidth,
  textSize,
  onClick,
  disabled
}: CustomButtonProps) => {


  return (
    <button
      type={`${buttonType}`}
      onClick={onClick}
      disabled={disabled}
      className={`${customWidth !== "no" && `w-${customWidth}`} uppercase bg-white px-${paddingX} py-${paddingY} text-${textSize} border border-gray-300 font-bold text-blue-600 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {text}
    </button>
  );
};

export default CustomButton;

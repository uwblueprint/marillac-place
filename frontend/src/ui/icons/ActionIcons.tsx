import React from "react";
import { IconProps } from "../../types/component";
import useChakraColor from "../../hooks/useChakraColor";

export const Comment: React.FC<IconProps> = ({
  size = 14,
  color = "text.light",
}) => {
  const iconColor = useChakraColor(color);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 7.585L8.415 7H1V1H9V7.585ZM9 0H1C0.45 0 0 0.45 0 1V7C0 7.55 0.45 8 1 8H8L10 10V1C10 0.45 9.55 0 9 0Z"
        fill={iconColor}
      />
    </svg>
  );
};

export const Pin: React.FC<IconProps> = ({ size = 16, color = "#0C727E" }) => {
  const iconColor = useChakraColor(color);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 1.33333V4.66667C6 5.41333 6.24667 6.10667 6.66667 6.66667H2.66667C3.1 6.09333 3.33333 5.4 3.33333 4.66667V1.33333H6ZM8 0H1.33333C0.966667 0 0.666667 0.3 0.666667 0.666667C0.666667 1.03333 0.966667 1.33333 1.33333 1.33333H2V4.66667C2 5.77333 1.10667 6.66667 0 6.66667V8H3.98V12.6667L4.64667 13.3333L5.31333 12.6667V8H9.33333V6.66667C8.22667 6.66667 7.33333 5.77333 7.33333 4.66667V1.33333H8C8.36667 1.33333 8.66667 1.03333 8.66667 0.666667C8.66667 0.3 8.36667 0 8 0Z"
        fill={iconColor}
      />
    </svg>
  );
};

export const Pinned: React.FC<IconProps> = ({
  size = 16,
  color = "#E67D4F",
}) => {
  const iconColor = useChakraColor(color);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.85714 5.25V1.5H8.57143C8.96429 1.5 9.28572 1.1625 9.28572 0.75C9.28572 0.3375 8.96429 0 8.57143 0H1.42857C1.03571 0 0.714286 0.3375 0.714286 0.75C0.714286 1.1625 1.03571 1.5 1.42857 1.5H2.14286V5.25C2.14286 6.495 1.18571 7.5 0 7.5V9H4.26429V14.25L4.97857 15L5.69286 14.25V9H10V7.5C8.81429 7.5 7.85714 6.495 7.85714 5.25Z"
        fill={iconColor}
      />
    </svg>
  );
};

export const Marker: React.FC<IconProps> = ({ size = 16, color = "black" }) => {
  const iconColor = useChakraColor(color);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM4 21C3.71667 21 3.47917 20.9042 3.2875 20.7125C3.09583 20.5208 3 20.2833 3 20V17.575C3 17.3083 3.05 17.0542 3.15 16.8125C3.25 16.5708 3.39167 16.3583 3.575 16.175L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.825 20.425C7.64167 20.6083 7.42917 20.75 7.1875 20.85C6.94583 20.95 6.69167 21 6.425 21H4ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z"
        fill={iconColor}
      />
    </svg>
  );
};

export const Plus: React.FC<IconProps> = ({ size = 14, color = "white" }) => {
  const iconColor = useChakraColor(color);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_iconCarrier">
        <path
          d="M4 12H20M12 4V20"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const Airplane: React.FC<IconProps> = ({
  size = 16,
  color = "black",
}) => {
  const iconColor = useChakraColor(color);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.8 8.43148L1.4 14.9315C1.06667 15.0648 0.75 15.0355 0.45 14.8435C0.15 14.6515 0 14.3725 0 14.0065V1.00648C0 0.639817 0.15 0.360817 0.45 0.169484C0.75 -0.0218496 1.06667 -0.0511832 1.4 0.0814834L16.8 6.58148C17.2167 6.76482 17.425 7.07315 17.425 7.50648C17.425 7.93982 17.2167 8.24815 16.8 8.43148ZM2 12.5065L13.85 7.50648L2 2.50648V6.00648L8 7.50648L2 9.00648V12.5065Z"
        fill={iconColor}
      />
    </svg>
  );
};

export const MagnifyingGlass: React.FC<IconProps> = ({
  size = 16,
  color = "black",
}) => {
  const iconColor = useChakraColor(color);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.071 15L9.5 9.5"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Download: React.FC<IconProps> = ({
  size = 16,
  color = "black",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 15V18H6V15H4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15H18ZM17 11L15.59 9.59L13 12.17V4H11V12.17L8.41 9.59L7 11L12 16L17 11Z"
      fill={color}
    />
  </svg>
);

export const Trash: React.FC<IconProps> = ({
  size = 16,
  color = "indicate.brightRed",
}) => {
  const iconColor = useChakraColor(color);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_6489_4204)">
        <path
          d="M4 7H20"
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 11V17"
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 11V17"
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7"
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7"
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_6489_4204">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const Menu: React.FC<IconProps> = ({ size = 16, color = "black" }) => {
  const iconColor = useChakraColor(color);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.791677 16.6868C0.566844 16.6868 0.378955 16.6102 0.228011 16.4572C0.0770665 16.3041 0.0010664 16.1157 1.08447e-05 15.8919C-0.00104471 15.6681 0.0749554 15.4803 0.228011 15.3282C0.381066 15.1763 0.568955 15.1008 0.791677 15.1018H24.5417C24.7665 15.1018 24.9544 15.1778 25.1053 15.3298C25.2573 15.4818 25.3333 15.6702 25.3333 15.8951C25.3333 16.1199 25.2573 16.3078 25.1053 16.4587C24.9533 16.6097 24.7655 16.6852 24.5417 16.6852L0.791677 16.6868ZM0.791677 9.13425C0.566844 9.13425 0.378955 9.05825 0.228011 8.90625C0.0770665 8.75425 0.0010664 8.56583 1.08447e-05 8.341C-0.00104471 8.11617 0.0749554 7.92828 0.228011 7.77733C0.381066 7.62639 0.568955 7.55092 0.791677 7.55092H24.5417C24.7665 7.55092 24.9544 7.62692 25.1053 7.77892C25.2563 7.93092 25.3323 8.11933 25.3333 8.34417C25.3344 8.569 25.2584 8.75689 25.1053 8.90783C24.9523 9.05878 24.7644 9.13425 24.5417 9.13425H0.791677ZM0.791677 1.58175C0.566844 1.58175 0.378955 1.50628 0.228011 1.35533C0.0760109 1.20333 1.08447e-05 1.01492 1.08447e-05 0.790083C1.08447e-05 0.56525 0.0760109 0.377361 0.228011 0.226417C0.380011 0.0754724 0.5679 0 0.791677 0H24.5417C24.7665 0 24.9544 0.0760001 25.1053 0.228C25.2563 0.38 25.3323 0.567361 25.3333 0.790083C25.3344 1.01281 25.2584 1.20069 25.1053 1.35375C24.9523 1.50681 24.7644 1.58281 24.5417 1.58175H0.791677Z"
        fill={iconColor}
      />
    </svg>
  );
};

export const Cross: React.FC<IconProps> = ({ size = 16, color = "black" }) => {
  const iconColor = useChakraColor(color);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.2267 18L1 1M18.2267 1L1 18"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const Swap: React.FC<IconProps> = ({ size = 14, color = "#0C727E" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.33366 6.41667L11.667 4.08333M11.667 4.08333L9.33366 1.75M11.667 4.08333H2.33366M4.66699 7.58333L2.33366 9.91667M2.33366 9.91667L4.66699 12.25M2.33366 9.91667H11.667"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

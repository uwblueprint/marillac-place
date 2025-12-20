import React from "react";
import { IconProps } from "../../types/component";
import useChakraColor from "../../hooks/useChakraColor";

export const Comment: React.FC<IconProps> = ({
  size = 14,
  color = "#626262",
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

export const PlusSign: React.FC<IconProps> = ({
  size = 14,
  color = "white",
}) => {
  const iconColor = useChakraColor(color);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill={iconColor} />
    </svg>
  );
};

export const Trash: React.FC<IconProps> = ({
  size = 16,
  color = "#E30000",
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

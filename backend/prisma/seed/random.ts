import { now } from "../../utils/dateUtils";

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?~";

export const number = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
export const password = () =>
  Array.from({ length: 12 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
export const date = (start = new Date(2022, 0, 1), end = now()) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

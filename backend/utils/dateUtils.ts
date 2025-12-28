import { toZonedTime } from "date-fns-tz";

export const now = () => toZonedTime(new Date(), "America/New_York");
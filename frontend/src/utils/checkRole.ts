import { jwtVerify } from "jose";

export async function isAdmin() {
  const token = localStorage.getItem("admin_token") ?? "";

  try {
    const secret = new TextEncoder().encode(process.env.REACT_APP_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    if (payload?.role !== "admin") {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

export async function isRelief() {
  const token = localStorage.getItem("admin_token") ?? "";

  try {
    const secret = new TextEncoder().encode(process.env.REACT_APP_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    if (payload?.role !== "relief") {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

export async function isParticipant() {
  const token = localStorage.getItem("participant_token") ?? "";

  try {
    const secret = new TextEncoder().encode(process.env.REACT_APP_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    if (payload?.role !== "participant") {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};
import { jwtVerify } from "jose";

export async function verifyRole(validRoles: string[]): Promise<boolean> {
  const token = localStorage.getItem("token") ?? "";
  try {
    const secret = new TextEncoder().encode(process.env.REACT_APP_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    if (!payload || !validRoles.includes(payload.role as string)) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

export async function getParticipantId() {
  const token = localStorage.getItem("token") ?? "";
  try {
    const secret = new TextEncoder().encode(process.env.REACT_APP_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (!payload || !payload.pid) {
      return null;
    }
    return Number(payload.pid);
  } catch (err) {
    return null;
  }
}

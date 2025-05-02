import { jwtVerify } from 'jose';

export default async function hasRole(role: string) {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }

  try {
    const secret = new TextEncoder().encode(process.env.REACT_APP_JWT_SECRET);
    const { payload, protectedHeader } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    if (payload?.role !== role) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};
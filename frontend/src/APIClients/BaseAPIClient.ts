import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
// import jwt from "jsonwebtoken";

import { jwtDecode } from "jwt-decode";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { DecodedJWT } from "../types/AuthTypes";
import { setLocalStorageObjProperty } from "../utils/LocalStorageUtils";

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

const baseAPIClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

baseAPIClient.interceptors.request.use(
  async (config: AdaptAxiosRequestConfig) => {
    const newConfig = { ...config };

    let authHeaderParts = [""];
    // if access token in header has expired, do a refresh
    if (typeof config.headers.Authorization === "string") {
      authHeaderParts = config.headers.Authorization?.split(" ");
    }

    // config.headers.Authorization?.split(" ");
    if (
      authHeaderParts &&
      authHeaderParts.length >= 2 &&
      authHeaderParts[0].toLowerCase() === "bearer"
    ) {
      const decodedToken = jwtDecode(authHeaderParts[1]) as DecodedJWT;

      if (
        decodedToken &&
        (typeof decodedToken === "string" ||
          decodedToken.exp <= Math.round(new Date().getTime() / 1000))
      ) {
        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const accessToken = data.accessToken || data.access_token;
        setLocalStorageObjProperty(
          AUTHENTICATED_USER_KEY,
          "accessToken",
          accessToken,
        );

        newConfig.headers.Authorization = accessToken;
      }
    }

    return newConfig;
  },
);

export default baseAPIClient;

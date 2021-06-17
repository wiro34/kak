/** @format */

export const WS_API_URL =
  process.env.NODE_ENV === "production"
    ? "wss://3az66tmwr4.execute-api.us-east-2.amazonaws.com/dev"
    : "ws://localhost:3001";
export const WS_TIMEOUT = 5e3;
export const WS_MAX_ATTEMPTS = 3;

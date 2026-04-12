import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:1337";
  return io(backendUrl, options);
};

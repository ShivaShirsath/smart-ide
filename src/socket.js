import { io } from "socket.io-client";

export const initSocket = async () => {
  return io("http://127.0.0.1:1337", {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  });
};

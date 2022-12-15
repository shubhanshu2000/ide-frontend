import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    "force new connection": false,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  return io("https://ide-backend-ewjt8g4bl-shubhanshu2000.vercel.app/", options);
};

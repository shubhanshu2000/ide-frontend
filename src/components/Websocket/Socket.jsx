import { io } from "socket.io-client";

export const initSocket = async () => {
  const url = "https://ide-backend-blond.vercel.app/"
  const options = {
    "force new connection": false,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    allowEIO3: true,
    transports: ["websocket"],
  };
  return io(url, options);
};

// lib/useSocket.ts
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

const useSocket = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true, 
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { socket, connected };
};

export default useSocket;

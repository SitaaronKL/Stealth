import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});

// Optional: Add connection event listeners
socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});

export default socket;

export const connectToDocument = (documentId: string) => {
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit("join-document", documentId);
};

export const disconnectFromDocument = () => {
  socket.disconnect();
}; 
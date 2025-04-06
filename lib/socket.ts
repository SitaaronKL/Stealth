import { io, Socket } from "socket.io-client";
import type { Layer } from "./types";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

interface ServerToClientEvents {
  "user-joined": (userData: { id: string; name: string; color: string }) => void;
  "user-left": (userId: string) => void;
  "current-users": (userIds: string[]) => void;
  "cursor-moved": (userId: string, position: { x: number; y: number }) => void;
  "layer-updated": (layer: Layer) => void;
}

interface ClientToServerEvents {
  "join-document": (documentId: string, userData: { id: string; name: string; color: string }) => void;
  "cursor-move": (documentId: string, userId: string, position: { x: number; y: number }) => void;
  "layer-update": (documentId: string, layer: Layer) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
});

// Optional: Add connection event listeners
socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});

export const connectToDocument = (
  documentId: string,
  userData: { id: string; name: string; color: string }
) => {
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit("join-document", documentId, userData);
};

export const updateCursor = (
  documentId: string,
  userId: string,
  position: { x: number; y: number }
) => {
  socket.emit("cursor-move", documentId, userId, position);
};

export const updateLayer = (documentId: string, layer: Layer) => {
  socket.emit("layer-update", documentId, layer);
};

export const disconnectFromDocument = () => {
  socket.disconnect();
};

export default socket; 
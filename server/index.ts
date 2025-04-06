import { Server } from "socket.io";
import { createServer } from "http";
import type { Layer } from "../lib/types";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Your Next.js app URL
    methods: ["GET", "POST"]
  }
});

// Track active users in each document
const documentUsers = new Map<string, Set<string>>();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  let currentDocument: string | null = null;

  socket.on("join-document", (documentId: string, userData: { id: string; name: string; color: string }) => {
    // Leave previous document if any
    if (currentDocument) {
      socket.leave(currentDocument);
      const users = documentUsers.get(currentDocument);
      if (users) {
        users.delete(userData.id);
        io.to(currentDocument).emit("user-left", userData.id);
      }
    }

    // Join new document
    socket.join(documentId);
    currentDocument = documentId;

    // Add user to document
    if (!documentUsers.has(documentId)) {
      documentUsers.set(documentId, new Set());
    }
    documentUsers.get(documentId)?.add(userData.id);

    // Broadcast user joined to others in the document
    socket.to(documentId).emit("user-joined", userData);

    // Send current users to the new user
    const users = Array.from(documentUsers.get(documentId) || []);
    socket.emit("current-users", users);
  });

  socket.on("cursor-move", (documentId: string, userId: string, position: { x: number; y: number }) => {
    socket.to(documentId).emit("cursor-moved", userId, position);
  });

  socket.on("layer-update", (documentId: string, layer: Layer) => {
    socket.to(documentId).emit("layer-updated", layer);
  });

  socket.on("new-comment", (documentId, comment) => {
    socket.to(documentId).emit("new-comment", comment);
  });

  socket.on("disconnect", () => {
    if (currentDocument) {
      const users = documentUsers.get(currentDocument);
      if (users) {
        users.delete(socket.id);
        io.to(currentDocument).emit("user-left", socket.id);
      }
    }
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
}); 
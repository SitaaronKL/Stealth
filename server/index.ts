import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Your Next.js app URL
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-document", (documentId) => {
    socket.join(documentId);
    console.log(`Client ${socket.id} joined document ${documentId}`);
  });

  socket.on("layer-update", (documentId, layer) => {
    socket.to(documentId).emit("layer-update", layer);
  });

  socket.on("cursor-move", (documentId, userId, position) => {
    socket.to(documentId).emit("cursor-move", userId, position);
  });

  socket.on("new-comment", (documentId, comment) => {
    socket.to(documentId).emit("new-comment", comment);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
}); 
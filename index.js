import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import { authRouter } from "./routes/route.js";
const app = express();
const server = createServer(app);
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
  })
);

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
export const userSocketMap = {};
export const waitingQueue = [];
export const inGame = [];

export const getRecieverSocketID = (receiverID) => {
  return userSocketMap[receiverID];
};
export const getRoomID = (roomID) => {
  return userSocketMap[receiverID];
};
io.on("connection", (socket) => {
  const userId = new mongoose.Types.ObjectId(socket.handshake.query.user);
  console.log("A user connected", userId);

  if (userId != undefined) {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  io.emit("getInGameUsers", Object.keys(inGame));

  //  creates room  and sends notification to friend
  socket.on("join", (userId, friend) => {
    socket.join(userId);
    socket.to(friend).emit("roomInvite", userId); 
    console.log(`user with id ${userId}  joined the room ${userId}`);
  });

  /// friend joins room through notification
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`${room.id} joined room: ${roomId}`);
  });
 
  // When a user requests matchmaking
  socket.on("findMatch", () => {
    if (waitingQueue.length > 0) {
      // Match with the first user in the queue
      const opponentId = waitingQueue.shift(); // Remove the first user
      const roomId = `room_${socket.id}_${opponentId}`; // Unique room ID

      // Join both users to the same room
      socket.join(roomId);
      io.to(opponentId).socketsJoin(roomId);

      // Notify both users
      io.to(roomId).emit("matchFound", { roomId, users: [socket.id, opponentId] });
      inGame.push(socket.id);
      inGame.push(opponentId);

      console.log(`Match found: ${socket.id} vs ${opponentId} in ${roomId}`);
    } else {
      // Add the current user to the queue
      waitingQueue.push(socket.id);
      console.log(`User added to queue: ${socket.id}`);
    }
  });

  //leave room
  socket.on("leave", (roomId) => {
    socket.leave(roomId);
    console.log(`User with ID ${socket.id} left the room ${roomId}`);
  });
  //dicconect

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
 

app.use('/game' , authRouter );
server.listen(3001, () => {
  console.log("server is listing on port 3001");
});

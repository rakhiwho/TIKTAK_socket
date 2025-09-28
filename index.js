import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { checkDraw, checkWin, player } from "./api/easy.js";
import { route } from "./routes/index.js";

dotenv.config({ path: "./.env" });

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(route);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

export const userSocketMap = {};
export const waitingQueue = [];
export const inGame = [];  

const GAME_BOARD = new Map();
const GAME_LASTSEEN = new Map();

 
setInterval(()=>{
  for (const [key, value] of GAME_LASTSEEN) {
    const time_now =  Date.now();

  if(time_now - value  >  15000){
    GAME_BOARD.delete(key)
  }
}

}, 15000)

io.on("connection", (socket) => {
  const user = socket.handshake.query.user;
  console.log(`User connected: ${user} with socket ${socket.id}`);

  // Add user to socket map
  if (!userSocketMap[user]) {
    userSocketMap[user] = [];
  }
  userSocketMap[user].push(socket.id);

  // Broadcast all users
  setTimeout(() => {
    io.emit("get_all_users", userSocketMap);
  }, 100);

  // Join game room
  socket.on("join", (userID) => {
    console.log(`User ${userID} joined`);
    socket.join(userSocketMap[user]);
  });

  // Messaging
  socket.on("send", ({ userId, text }) => {
    if (userSocketMap[userId]) {
      userSocketMap[userId].forEach((socketId) => {
        socket.to(socketId).emit("receive", text);
      });  
    }
  });

  // Invite system
  socket.on("sendInvite", ({ id, userName }) => {
    if (userSocketMap[id]) {
      userSocketMap[id].forEach((socketId) => {
        socket.to(socketId).emit("inviteSent", { user, userName });
      });
    }
  });

  socket.on("acceptInvite", ({ p, userid, user1 }) => {
    if (userSocketMap[userid]) {
      userSocketMap[userid].forEach((socketId) => {
        socket.to(socketId).emit("inviteAccepted", { p, user: user1 });
      });
    }
  });
socket.on("refreshing", ({ gameId, user1 }) => {
      const gameFromBackend = GAME_BOARD.get(gameId)
  if (userSocketMap[user1]) {
    userSocketMap[user1].forEach((socketId) => {
      io.to(socketId).emit("recieveID", {
        gameFromBackend
      });
    });
  }
});


  socket.on("sendGameID", ({ id , user }) => {
    if (userSocketMap[user]) {
      userSocketMap[user].forEach((socketId) => {
        socket.to(socketId).emit("gameId", { id });
      });
    }
  });

  

  // Game update
  socket.on("updateGame", ({ id , newBoard, userid, row, col, p, quite }) => {
    GAME_BOARD.set(id , newBoard);
    GAME_LASTSEEN.set(id , Date.now());

    if (quite) {
      socket.leave(userSocketMap[userid]);
      socket.to(userSocketMap[userid]).emit("quite", quite);
    } else {
      const winner = checkWin(row, col, newBoard, p);
      const draw = checkDraw(newBoard, winner);
      if (userSocketMap[userid]) {
        userSocketMap[userid].forEach((socketId) => {
          socket.to(socketId).emit("updateGameIn", {
            p,
            newBoard,
            winner,
            draw,
          });
        });
      }
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${user}`);

    if (userSocketMap[user]) {
      userSocketMap[user] = userSocketMap[user].filter(
        (id) => id !== socket.id
      );
      if (userSocketMap[user].length === 0) {
        delete userSocketMap[user];
      }
    }

    io.emit("get_all_users", userSocketMap);
  });
});

// Start server
const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

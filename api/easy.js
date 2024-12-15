// const { Server } = require("socket.io");
// const io = new Server(3001, {
//   cors: {
//     origin: "http://localhost:3000", // Adjust based on your frontend
//     credentials: true,
//   },
// });

// const rooms = {}; // Store game state for each room

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   // Handle when a user joins a room
//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);

//     if (!rooms[roomId]) {
//       // Initialize game state for the room
//       rooms[roomId] = {
//         players: [socket.id],
//         gameState: {
//           board: Array(9).fill(""), // Example: Tic-tac-toe board
//           // currentPlayer: "",
//         }
//       };                                                                        
//     } else {
//       // Add the second player
//       rooms[roomId].players.push(socket.id);
//       if (rooms[roomId].players.length === 2) {
//         // Start the game when 2 players are present
//         const [player1, player2] = rooms[roomId].players;
//         rooms[roomId].gameState.currentPlayer = player1;

//         io.to(roomId).emit("startGame", {
//           message: "Game started!",
//           currentPlayer: player1,
//           board: rooms[roomId].gameState.board,
//         });
//       }
//     }
//   });

//   // Handle a player's move
//   socket.on("makeMove", ({ roomId, index }) => {
//     const room = rooms[roomId];
//     if (!room) return;

//     const { board, currentPlayer } = room.gameState;

//     if (socket.id === currentPlayer && board[index] === null) {
//       board[index] = socket.id; // Mark the board with the player's ID
//       room.gameState.currentPlayer =
//         currentPlayer === room.players[0] ? room.players[1] : room.players[0]; // Switch turn

//       io.to(roomId).emit("updateGame", {
//         board,
//         currentPlayer: room.gameState.currentPlayer,
//       });

//       // Check for win/draw condition
//       if (checkWin(board)) {
//         io.to(roomId).emit("gameOver", {
//           winner: socket.id,
//           board,
//         });
//         delete rooms[roomId]; // Clean up room data
//       } else if (board.every((cell) => cell !== null)) {
//         io.to(roomId).emit("gameOver", { winner: null, message: "It's a draw!" });
//         delete rooms[roomId]; // Clean up room data
//       }
//     }
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//     // Clean up rooms where this user was a player
//     for (const [roomId, room] of Object.entries(rooms)) {
//       if (room.players.includes(socket.id)) {
//         io.to(roomId).emit("gameOver", { message: "Opponent disconnected." });
//         delete rooms[roomId];
//       }
//     }
//   });

//   // Check for a win
//   function checkWin(board) {
//     const winningCombinations = [
//       [0, 1, 2],
//       [3, 4, 5],
//       [6, 7, 8],
//       [0, 3, 6],
//       [1, 4, 7],
//       [2, 5, 8],
//       [0, 4, 8],
//       [2, 4, 6],
//     ];
//     return winningCombinations.some(
//       ([a, b, c]) => board[a] && board[a] === board[b] && board[b] === board[c]
//     );
//   }
// });

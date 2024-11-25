import mongoose ,{Schema , model}  from "mongoose";

const gameRoomSchema = new Schema({
  roomId: String,
  players: [String],
  board: [String], 
  currentPlayer: String, 
  createdAt: { type: Date, default: Date.now }
});

export const GAMEMODEL = model("GameRoom", gameRoomSchema);

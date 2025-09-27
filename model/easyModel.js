import mongoose, { Schema, model } from "mongoose";

const gameRoomSchema = new Schema({
  roomId: String,
  players: [
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      required: true,
    },
  ],
  board: [[String]],
  currentPlayer: String,
  winner: String,
  result: String,
  createdAt: { type: Date, default: Date.now },
});

export const GAMEMODEL = model("GameRoom", gameRoomSchema);

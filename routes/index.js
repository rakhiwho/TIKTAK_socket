import express from "express";
import { gameRoute } from "./pre_game.js";
import { inGameRoute } from "./game.js";

const route = express.Router();
route.use("/game", gameRoute);
route.use("/game", inGameRoute);

export { route };

import { Router } from "express";
import {  getGameCon } from "../api/joining.js";
import { updateGameCon } from "../api/joining.js";
const route = Router();
route.post("/", getGameCon);
route.post("/update", updateGameCon);

export { route as inGameRoute };

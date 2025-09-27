import { Router } from "express";
import {  startGameCon } from "../api/joining.js";

const route = Router();
route.post("/join", startGameCon);

export { route as gameRoute };

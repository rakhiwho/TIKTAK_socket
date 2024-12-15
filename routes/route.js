import express from "express"
import { getGame, startGame, updateGame } from "../api/joining.js";


const route = express.Router();
route.get('/' , getGame)
route.post("/join" , startGame);
route.put("/update" , updateGame );

export  {route as authRouter}
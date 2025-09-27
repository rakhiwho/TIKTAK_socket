import { GAMEMODEL } from "../model/easyModel.js";
import DefaultRepository from "./index.js"
 export class GameRepository extends  DefaultRepository {
    constructor (){
        super(GAMEMODEL);
    }
}
import UserModel from "../model/user.js";
import DefaultRepository from "./index.js";

 export class UserRepository extends  DefaultRepository {
    constructor (){
        super( UserModel);
    }
}
import { GameRepository } from "../repository/game.js";
import { UserRepository } from "../repository/user.js";
import { inGame } from "../index.js";

const gameRepository = new GameRepository();
const userRepository = new UserRepository();

// {
//   p: '68ce565c53bca3d4995c7040',
//   player2: '68d0cd7041cda673e3065ecd',
//   game: [ [ 'O', 'X', '' ], [ '', '', '' ], [ '', '', '' ], 'O' ],
//   currentPlayer: 'O',
//   winner: '',
//   result: ''
// }
async function startGame(data) {
  try {
    const p1 = await userRepository.findById(data?.p);
    const p2 = await userRepository.findById(data?.player2);
    if (!p1 || !p2) {
      throw new Error("one of two or both player doesn't exist!", 400);
    }
    let current = data?.currentPlayer === "O" ? "X" : "O";
    const newGame = gameRepository.create({
      roomId: data?.p,
      players: [data?.p, data?.player2],
      board: data?.game,
      currentPlayer: current,
      winner: data.winner,
      result: data.result,
    });
    inGame.push(p1._id);
    inGame.push(data?.player2);
    return newGame;
  } catch (error) {
    console.log(error);
    throw new Error("couldn't create game , something went wrong", 500);
  }
}

async function getGame(data) {
  try {
    const game = await gameRepository.findById(data);

    if (!game) {
      throw new Error("game wasn't found", 404);
    }
    return game;
  } catch (error) {
    throw new Error("couldn't create game , something went wrong", 500);
  }
}

async function updateGame(data) {
   
  try {
    const p1 = await userRepository.findById(data.player1);
    const p2 = await userRepository.findById(data.player2);
    if (!p1 || !p2) {
      throw new Error("one of two or both player doesn't exist!", 400);
    }
    const game = await gameRepository.findById(data.gameId);
    if (!game) {
      console.log(game)
      throw new Error("game wasn't found", 404);
    }
     let current = data?.currentPlayer === "O" ? "X" : "O" ;
    const resGame = await gameRepository.update({
      roomId : game.roomId,
      board : data.game ,
      currentPlayer :  current,
      players : [p1._id ,  p2._id],
      winner :  data?.winner ,
      result :  data?.result,
      _id :  game._id
    });

    return resGame;
  } catch (error) {
    console.log(error)
    throw new Error("couldn't create game , something went wrong", 500);
  }
}

export default { updateGame, startGame, getGame };

import { GAMEMODEL } from "../model/easyModel.js";
import UserModel from "../model/user.js";
import { inGame, waitingQueue } from "../index.js";

export const getGame = async (req, res) => {
  try {
    const { gameId } = req.body;

    const game = await GAMEMODEL.findById({ gameId });

    if (!game) {
      return res.status(404).json("game not found ,something is wrong ");
    }

    return res.status(200).json(game);

  } catch (error) {
    return res.status(500).json("something went wrong!");
  }
};

export const startGame = async (req, res) => {
  const { player1, player2, game, currentPlayer, winner, result } = req.body;

  try {
    const p1 = await UserModel.findById({ player1 });
    const p2 = await UserModel.findById({ player2 });

    if (!p1 || !p2) {
      return res.status(400).json(" one of the given player doesnt exist");
    }

    const current = {};
    currentPlayer === player1 ? (current = p1) : (current = p2);
    const newGame = new GAMEMODEL({
      roomId: player1,
      players: [p1, p2],
      board: [game],
      currentPlayer: current,
       winner,
       result,
    });
    await newGame.save();
    waitingQueue = waitingQueue.filter(
      (player) => player !== player1 && player !== player2
    );
    inGame.push(player1);
    inGame.push(player2);
    return res.status(200).json(newGame);
  } catch (error) {
    return res.status(500).json("somehting went wrong ", error);
  }
};

export const updateGame = async (req, res) => {
  const { player1, player2, gameId, board, currentPlayer, winner, result } =
    req.body;

  try {
    const p1 = await UserModel.findById({ player1 });
    const p2 = await UserModel.findById({ player2 });
    const game = await GAMEMODEL.findById({ gameId });

    if (!p1 || !p2) {
      returnres.status(400).json(" one of the given player diesnt exist");
    }

    if (!game) {
      return res.status(400).json("either game doesnt exist or game ended");
    }
    const current = {};
    currentPlayer === player1 ? (current = p1) : (current = p2);
    game.board = board;
    game.currentPlayer = current;
    game.winner = winner;
    game.result = result;

    await game.save();
    inGame = inGame.filter(
      (player) => player !== player1 && player !== player2
    );

    return res.status(200).json(game);
  } catch (error) {
    return res.status(500).json("somehting went wrong ", error);
  }
};

import { inGameService } from "../service/index.js";

export const getGameCon = async (req, res) => {
  try {
    const game = await inGameService.getGame(req.query.gameId);
    return res.status(200).json(game);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const startGameCon = async (req, res) => {
  try {
    const game = await inGameService.startGame(req?.body);
    return res.status(201).json(game);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateGameCon = async (req, res) => {
  try {
    const game = await inGameService.updateGame(req?.body);
    return res.status(200).json(game);
  } catch (error) {
    return res.status(500).json(error);
  }
};

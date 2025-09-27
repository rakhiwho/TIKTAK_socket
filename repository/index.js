export default class DefaultRepository {
  constructor(model) {
    this.model = model;
  }

  // Return all documents matching filter
  async find(filter) {
    return await this.model.find({filter});
  }

  // Find one document by ID
  async findById(id) {
    return await this.model.findById(id);
  }

  // Update a document
  async update(data) {
    const game = await this.findById(data?._id);
    if (!game) throw new Error('Document not found');

    game.currentPlayer = data?.currentPlayer;
    game.board = data?.board;
    game.winner = data?.winner;
    game.result = data?.result;

    await game.save();
    return game;
  }

  // Delete one document
  async delete(filter) {
    return await this.model.deleteOne(filter);
  }

  // Create and save a document
  async create(data) {
    const doc = new this.model({ ...data });
    return await doc.save();
  }
}

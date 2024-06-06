class Block {
  static BLOCK_WIDTH = 50;
  static BLOCK_HEIGHT = 50;

  #worldObject;
  #world;
  #blockX;
  #blockY;
  #chunkX;
  #chunkY;
  #blockClass;

  constructor(world, blockX, blockY, chunkX, chunkY, blockClass) {
    this.#worldObject = null;
    this.#world = world;
    this.#blockX = blockX;
    this.#blockY = blockY;
    this.#chunkX = chunkX;
    this.#chunkY = chunkY;
    this.#blockClass = blockClass;
  }

  setWorldObject(worldObject) {
    this.#worldObject = worldObject;
  }

  getWorldObject() {
    return this.#worldObject;
  }

  getWorld() {
    return this.#world;
  }

  getBlockX() {
    return this.#blockX;
  }

  getBlockY() {
    return this.#blockY;
  }

  getChunkX() {
    return this.#chunkX;
  }

  getChunkY() {
    return this.#chunkY;
  }

  getBlockClass() {
    return this.#blockClass;
  }

  setBlockClass(blockClass) {
    this.#blockClass = blockClass;
  }

}

module.exports = Block;

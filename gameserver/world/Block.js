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
  #biomeClass;

  constructor(world, blockX, blockY, chunkX, chunkY, blockClass, biomeClass) {
    this.#worldObject = null;
    this.#world = world;
    this.#blockX = blockX;
    this.#blockY = blockY;
    this.#chunkX = chunkX;
    this.#chunkY = chunkY;
    this.#blockClass = blockClass;
    this.#biomeClass = biomeClass;
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

  getBiomeClass() {
    return this.#biomeClass;
  }

  setBiomeClass(biomeClass) {
    this.#biomeClass = biomeClass;
  }

}

module.exports = Block;

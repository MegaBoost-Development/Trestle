class Chunk {

  static CHUNK_WIDTH = 800;
  static CHUNK_HEIGHT = 800;
  #chunkPosition;
  #loaded;
  #entities;
  #blocks;

  constructor(chunkPosition) {
    this.#chunkPosition = chunkPosition;
    this.#loaded = true;
    this.#entities = new Map();
    this.#blocks = [];
  }

  generate() {
    const noise2D = this.getChunkPosition().getWorld().getNoise2D();
    const offsetX = this.getChunkPosition().getX() * CHUNK_WIDTH;
    const offsetY = this.getChunkPosition().getY() * CHUNK_HEIGHT;

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        //this.#blocks[y][x] = new Block();
      }
    }

  }

  getChunkPosition() {
    return this.#chunkPosition;
  }

  isLoaded() {
    return this.#loaded;
  }

  addEntity(entity) {
    this.#entities.set(entity.getId(), entity);
  }

  removeEntity(id) {
    this.#entities.delete(id);
  }

  getEntity(id) {
    return this.#entities.get(id);
  }

  getBlocks() {
    return this.#blocks;
  }

  getBlock(x, y) {
    return this.#blocks[y][x];
  }

}

module.exports = Chunk;

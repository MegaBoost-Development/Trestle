class Chunk {

  #chunkPosition;
  #loaded;

  constructor(chunkPosition) {
    this.#chunkPosition = chunkPosition;
    this.#loaded = true;
  }

  getChunkPosition() {
    return this.#chunkPosition;
  }

  isLoaded() {
    return this.#loaded;
  }

}

module.exports = Chunk;

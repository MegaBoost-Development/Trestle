class ChunkPosition {

  #x;
  #y;
  #world;

  constructor(x, y, world) {
    this.#x = x;
    this.#y = y;
    this.#world = world;
  }

  getX() {
    return this.#x;
  }

  getY() {
    return this.#y;
  }

  getWorld() {
    return this.#world;
  }

  getStringIdentifier() {
    return `${this.getX()}${this.getY()}`;
  }

}

module.exports = ChunkPosition;

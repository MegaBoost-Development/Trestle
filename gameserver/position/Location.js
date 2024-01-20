class Location {

  #x;
  #y;
  #world;
  #chunk;

  constructor(x, y, world) {
    this.#x = x;
    this.#y = y;
    this.#world = world;
    if (world != null && world != undefined) world.getChunkByPosition(x, y);
  }

  static CoordinateInstance(x, y) {
    return new Location(x, y, null);
  }

  getX() {
    return this.#x;
  }

  setX(x) {
    this.#x = x;
  }

  getY() {
    return this.#y;
  }

  setY(y) {
    this.#y = y;
  }

  getWorld() {
    return this.#world;
  }

  setWorld(world) {
    this.#world = world;
  }

  getChunk() {
    return this.#chunk;
  }

  setChunk(chunk) {
    this.#chunk = chunk;
  }

  isSameLocation(loc) {
    return this.getX() == loc.getX() && this.getY() == loc.getY() && this.getChunk() == loc.getChunk() && this.getWorld() == loc.getWorld();
  }

}

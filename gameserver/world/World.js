class World {

  #name;
  #seed;
  #chunks;

  constructor(name, seed) {
    this.#name = name;
    this.#seed = seed;
    this.#chunks = new Map();
  }

  generateWorld() {

  }

  static generateWorldFromFile(fileName) {
    //parse world data from file system
  }

}

module.exports = World;

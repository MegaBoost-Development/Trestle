const FS = require("fs");
const Chunk = require("./Chunk.js");
const ChunkPosition = require("./ChunkPosition.js");

class World {

  #gameServer;
  #name;
  #seed;
  #chunks;
  #noise2d;
  #biomeIndex;

  constructor(gameServer, name, seed, biomeIndex) {
    this.#gameServer = gameServer;
    this.#name = name;
    this.#seed = seed;
    this.#biomeIndex = biomeIndex;
    this.#chunks = new Map();
    this.#noise2d = gameServer.createNoise2D(seed);
  }

  generate() {

    let minSizeX = 2;
    let minSizeY = 2;

    let chunkPosition;
    for (let y = Math.floor(-minSizeY/2); y < Math.floor(minSizeY/2); y++) {
      for (let x = Math.floor(-minSizeX/2); y < Math.floor(minSizeX/2); y++) {
        chunkPosition = new ChunkPosition(x, y, this);
        this.#chunks.set(chunkPosition.getStringIdentifier(), new Chunk(chunkPosition));
      }
    }


  }

  save() {
    /*

    this.#chunks.forEach((chunk, chunkPos) => {
      console.log(chunk.getSaveData());
    });

    */

    /*
    FS.writeFile(`./worlds/${this.getName()}/world.mbwdf`, `${this.getName()},${this.getSeed()}`, { flag: 'w+' }, function (err) {
      if (err) throw err;
    });
    */

    //TODO: Chunk Data
  }

  getName() {
    return this.#name;
  }

  getSeed() {
    return this.#seed;
  }

  getChunkMap() {
    return this.#chunks;
  }

  getOrNewChunk(chunkPosition) {
    let chunk = this.#chunks.get(chunkPosition.getStringIdentifier());
    if (chunk == null) {
      chunk = new Chunk(chunkPosition);
      this.#chunks.set(chunkPosition.getStringIdentifier(), chunk);
    }

    return chunk;
  }

  getNoise2D() {
    return this.#noise2d;
  }

  getBiomeIndex() {
    return this.#biomeIndex;
  }

  getBlockClassFromHeight(height) {
    const biomeIndex = this.getBiomeIndex();

    let blockData;
    for (let i = 0; i < biomeIndex.heightMap.length; i++) {
      blockData = biomeIndex.heightMap[i];
      if (height <= blockData.height) return blockData.blockClass;
    }

    this.#gameServer.log(`[WORLD] [ERROR] Height: ${height} is not covered by the biome index!`);
    return null;

  }

  static loadOrGenerateNew(gameServer, fileName, biomeIndex) {
    gameServer.log(`[WORLD] Starting to load: ${fileName}`);
    //parse world data from file system
    FS.readdir(`./worlds/${fileName}`, (e, files) => {
      if (e || !files) {
        //let seed = Math.floor(Math.random() * 1000000);
        let seed = 0;
        gameServer.log(`[WORLD] ${fileName} not found. Generating with seed: ${seed} and biome index: ${biomeIndex.name}`);
        let start = Date.now();
        let world = new World(gameServer, fileName, seed, biomeIndex);
        world.generate();
        gameServer.log(`[WORLD] Generation took: ${Date.now() - start} ms!`);
        gameServer.log(`[WORLD] Saving current state of: ${fileName}`);
        world.save();
        gameServer.addWorld(world);
        return;
      }

      files.forEach((file) => {
        if (!file.endsWith(".mbwdf")) return;

        FS.readFile(`../../worlds/${fileName}/world.`, (err, data) => {
          if (err) throw err;

          let worldData = data.split(",");
          let world = new World(gameServer, worldData[0], Number(worldData[1]), biomeIndex);

        })
      });

    });
  }

}

module.exports = World;

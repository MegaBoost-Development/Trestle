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


  getChunkByWorldPosition(x, y) {
      let chunkX = Math.floor(x / Chunk.CHUNK_WIDTH);
      let chunkY = Math.floor(y / Chunk.CHUNK_HEIGHT);
      //if (x < 0 && x % Chunk.CHUNK_WIDTH != 0) chunkX--;
      //if (y < 0 && y % Chunk.CHUNK_HEIGHT != 0) chunkY--;
      return this.getOrNewChunk(new ChunkPosition(chunkX, chunkY, this));
    }

    getBlockByWorldPosition(x, y) {
      const chunk = this.getChunkByWorldPosition(x, y);

      let blockY = Math.floor((y - (chunk.getChunkY() * Chunk.CHUNK_HEIGHT))/50);
      let blockX = Math.floor((x - (chunk.getChunkX() * Chunk.CHUNK_WIDTH))/50);

      //Ensure a valid block is returned.
      if (blockX >= 15) blockX = 15;
      if (blockX < 0) blockX = 0;
      if (blockY >= 15) blockY = 15;
      if (blockY < 0) blockY = 0;

      return chunk.getBlocks()[blockY][blockX];
    }

    getBlockByBlockPosition(x, y) {
      return this.getBlockByWorldPosition(x * 50, y * 50);
    }

    getChunkByBlockPosition(x, y) {
      return this.getChunkByWorldPosition(x * 50, y * 50);
    }

  getNoise2D() {
    return this.#noise2d;
  }

  getBiomeIndex() {
    return this.#biomeIndex;
  }

  getBlockDataFromHeight(height) {
    const biomeIndex = this.getBiomeIndex();

    let blockData = biomeIndex.heightMap[0];
    for (let i = 1; i < biomeIndex.heightMap.length; i++) {
      if (height <= blockData.height && height <= biomeIndex.heightMap[i].height) blockData = biomeIndex.heightMap[i];
    }

    if (blockData == null) {
      this.#gameServer.log(`[WORLD] [ERROR] Height: ${height} is not covered by the biome index!`);
      return null;
    }
    return [blockData.blockClass, blockData.biomeClass];

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

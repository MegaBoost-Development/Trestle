const ChunkPosition = require("./../world/ChunkPosition.js");

module.exports = async (ioServer, gameServer, client, packetData) => {
  let worldName = packetData.world[0];
  let id = client.id;
  let chunkX = packetData.chunkX[0];
  let chunkY = packetData.chunkY[0];

  const world = gameServer.getWorld(worldName);
  if (world == null) {
    gameServer.log(`[WORLD] [ERROR] Client requested chunks for a non existant world: ${worldName}`);
    return;
  }

  let chunk = world.getOrNewChunk(new ChunkPosition(chunkX, chunkY, world));
  client.emit("AddChunk", chunkX, chunkY, worldName, chunk.getSaveData(), chunk.getWorldObjectData());

}

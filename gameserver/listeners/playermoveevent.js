const Player = require("../entity/Player.js");

module.exports = async (ioServer, gameServer, client, packetData) => {
  let id = client.id;
  let x = packetData.toX[0];
  let y = packetData.toY[0];
  let worldName = packetData.toWorld[0];

  const playerLoc = gameServer.getPlayerById(id).getLocation();
  playerLoc.setX(x);
  playerLoc.setY(y);
  playerLoc.setWorld(gameServer.getWorld(worldName));

  ioServer.emit("EntityAllowedMove", id, x, y, worldName);

}

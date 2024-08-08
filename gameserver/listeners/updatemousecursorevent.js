const Player = require("../entity/Player.js");
const Location = require("../position/Location.js");

module.exports = async (ioServer, gameServer, client, packetData) => {
  const id = client.id;
  const x = packetData.screenX[0];
  const y = packetData.screenY[0];
  const angle = packetData.angle[0];

  const player = gameServer.getPlayerById(id);
  if (player == null) return;

  player.setCursorAngle(angle);
  player.setMouseScreenLocation(new Location(x, y));

}

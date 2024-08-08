const Player = require("../entity/Player.js");

const max_variation = 10;

module.exports = async (ioServer, gameServer, client, packetData) => {
  let id = client.id;
  let desiredX = packetData.toX[0];
  let desiredY = packetData.toY[0];
  let clientXVel = packetData.xVel[0];
  let clientYVel = packetData.yVel[0];
  let worldName = packetData.toWorld[0];

  const player = gameServer.getPlayerById(id);
  const playerLoc = player.getLocation();

  //HYPOTHETICAL ANTI MOVEMENT HACK

  /*
  console.log(clientXVel);
  console.log(clientYVel);
  let currentX = playerLoc.getX();
  let currentY = playerLoc.getY();
  let speed = player.getSpeed();
  console.log(speed);

  if (clientXVel != 0 && clientYVel != 0) {
    if (Math.abs(clientXVel) != Math.floor(0.8 * speed)) clientXVel = Math.sign(clientXVel) * Math.floor(0.8 * speed);
    if (Math.abs(clientYVel) != Math.floor(0.8 * speed)) clientYVel = Math.sign(clientYVel) * Math.floor(0.8 * speed);
  } else {
    if (clientXVel != 0 && Math.abs(clientXVel) != speed) clientXVel = Math.sign(clientXVel) * speed;
    if (clientYVel != 0 && Math.abs(clientYVel) != speed) clientYVel = Math.sign(clientYVel) * speed;
  }

  let x = currentX + clientXVel;
  let y = currentY + clientYVel;

  if (Math.abs(x - desiredX) >= max_variation || Math.abs(y - desiredY) >= max_variation) gameServer.log(`[MOVEMENT] ${id} moved unexpectedly! Reported: (${desiredX},${desiredY}) Calculated: (${x},${y})`);
  else {
    x = desiredX;
    y = desiredY;
  }
  */


  playerLoc.setX(desiredX);
  playerLoc.setY(desiredY);
  playerLoc.setWorld(gameServer.getWorld(worldName));

  ioServer.emit("EntityAllowedMove", packetData.packetSentAt[0], id, desiredX, desiredY, worldName);

}

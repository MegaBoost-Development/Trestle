module.exports = async (ioServer, gameServer, client, packetData) => {

  const id = client.id;
  const speed = packetData.speed[0];
  ioServer.emit("EntityAllowedSpeedChange", id, speed);

}

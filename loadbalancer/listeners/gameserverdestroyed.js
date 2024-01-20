module.exports = async (loadBalancer, client, gameServer, packetData) => {

  loadBalancer.log(`Disconnected from ${gameServer.getName()}`);
  loadBalancer.removeGameServer(client.id);

}

module.exports.run = async (loadBalancer, client, packetData) => {

  loadBalancer.log(`Disconnected from ${loadBalancer.getGameServerById(client.id).getName()}`);
  loadBalancer.removeGameServer(client.id);

}

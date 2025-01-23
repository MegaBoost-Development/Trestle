const Command = require("../Command.js");

class HelpCommand extends Command {
  constructor() {
    super("help", "/help", "View all commands and their usage!");

  }

  execute(ioServer, gameServer, client, args) {

    client.emit("PlayerSendChatMessage", "", "Help is here!")
    gameServer.getCommands().forEach((name, command) => {
      client.emit("PlayerSendChatMessage", "", ` - ${command.getUsage()} | ${command.getDescription()}`);
    });

  }
}

const Command = require("../modules/struct/command");

class Ping extends Command {
    constructor(client) {
        super(client);
        this.name = "Ping";
        this.aliases = ["pong", "latency"];
        this.description = "Returns the latency of the API."        
        this.usage = "**ping**";
        this.cooldown = 3000;
    }

    async run(client, message, args) {
        if (args.length !== 0) throw new Error(`Invalid Usage - Correct Usage: ${this.settings.usage}`); //Enforces correct usage
        message.channel.send("Pong!"); //Output message
    }
}

module.exports = Ping;

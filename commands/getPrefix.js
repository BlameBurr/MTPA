const Command = require("../modules/struct/command");

class GetPrefix extends Command {
    constructor(client) {
        super(client);
        this.name = "GetPrefix";
        this.aliases = ["prefix"];
        this.category = "Utility";
        this.description = "Fetches prefix from database.";
        this.usage = "**getprefix**";
    }

    async run(client, message, args) {
        if (args.length !== 0) throw new Error(`Invalid Usage - Correct Usage: ${this.settings.usage}`); //Enforces correct usage
        let msgPrefix = client.db.prefix.get(message.guild.id);
        message.reply(`Your current prefix is ${msgPrefix}`);
    }
}

module.exports = GetPrefix;

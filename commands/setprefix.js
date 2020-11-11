const Command = require("../modules/struct/command");

class SetPrefix extends Command {
    constructor(client) {
        super(client);
        this.name = "SetPreifix";
        this.category = "Utility";
        this.description = "Allows you to set the prefix.";
        this.usage = "**setprefix** *prefix*";
    }

    async run(client, message, args) {
        if (args.length < 1) throw new Error(`Invalid Usage - Correct Usage: ${this.settings.usage}`); //Enforces correct usage
        client.db.prefix.set(message.guild.id, args[0]);
        message.reply(`Your new prefix is ${args[0]}`);
    }
}

module.exports = SetPrefix;

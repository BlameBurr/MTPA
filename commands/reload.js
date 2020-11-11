const Command = require("../modules/struct/command");

class Reload extends Command {
    constructor(client) {
        super(client);
        this.name = "Reload";
        this.aliases = ["refresh_cache"];
        this.category = "Utility";
        this.description = "Reloads command file cache.";
        this.usage = "**reload** *command*";
    }

    async run(client, message, args) {
        if (args.length !== 1) throw new Error(`Invalid Usage - Correct Usage: ${this.settings.usage}`); //Enforces correct usage
        let commandName = args[0].toLowerCase();
        let command = client.commands.get(commandName) // This gets the command from the collection that we set when we loaded the bot
            || client.commands.find(cmd => cmd.settings.aliases && cmd.settings.aliases.includes(commandName));
        if (!command) throw new Error(`Invalid Command, make sure that the command exists.`);
        try {
            delete require.cache[require.resolve(`./${command.settings.name}.js`)];
            const newCommand = require(`./${command.settings.name}.js`);
            client.commands.set(newCommand.settings.name, newCommand);
            client.verbose(`Command \`${commandName}\` was reloaded!`, 0);
            message.channel.send(`Command \`${commandName}\` was reloaded!`);
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = Reload;

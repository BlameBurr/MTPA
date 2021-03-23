const Command = require('../modules/base/command');
const { isOwner } = require('../modules/utils');
const { UserError } = require('../modules/base/error');

class Reload extends Command {
	constructor(client) {
		super(client);
		this.name = 'Reload';
		this.aliases = ['refresh_cache'];
		this.category = 'Owner';
		this.description = 'Reloads command file cache.';
		this.usage = '**reload** *command*';
	}

	async run(client, message, args) {
		if (args.length !== 1) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
		if (!isOwner(message.author.id)) throw new UserError('Invalid permissions - this is an owner only command, sorry.'); // This command is more for development
		let commandName = args[0].toLowerCase();
		let fetchedCommand = client.commands.get(commandName) // This gets the command from the collection that we set when we loaded the bot
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!fetchedCommand) throw new UserError('Invalid Command, make sure that the command exists.');
		let buffer = fetchedCommand; // Required because after deleting the entry from the map it will not return the correct information
		commandName = buffer.name.toLowerCase(); // Save a buffer of the name else it will be deleted with the command
		client.commands.delete(commandName); // Remove from map
		delete require.cache[require.resolve(`./${commandName}`)]; // Unload any required instances
		let commandFile = require(`./${commandName}`); // Reload
		let updatedCommand = new commandFile(this); // Create object from class
		client.commands.set(updatedCommand.name.toLowerCase(), updatedCommand); // Readd to map
		client.verbose(`Command \`${updatedCommand.name}\` was reloaded!`, 0); // Log it
		message.channel.send(`Command \`${updatedCommand.name.toLowerCase()}\` was reloaded!`);
	}
}

module.exports = Reload;

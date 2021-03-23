const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

class GetPrefix extends Command {
	constructor(client) {
		super(client);
		this.name = 'GetPrefix';
		this.aliases = ['prefix'];
		this.category = 'Utility';
		this.description = 'Fetches prefix from database.';
		this.usage = '**getprefix**';
	}

	async run(client, message, args) {
		if (args.length !== 0) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
		let msgPrefix = client.db.prefix.get(message.guild.id); // Uses database module to fetch prefix
		message.reply(`Your current prefix is ${msgPrefix}`);
	}
}

module.exports = GetPrefix;

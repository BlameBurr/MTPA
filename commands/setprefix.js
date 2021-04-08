const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

class SetPrefix extends Command {
	constructor(client) {
		super(client);
		this.name = 'SetPrefix';
		this.category = 'Utility';
		this.description = 'Allows you to set the prefix.';
		this.usage = '**setprefix** *prefix*';
	}

	async run(client, message, args) {
		if (args.length != 1) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
		if (!message.member.hasPermission(['MANAGE_GUILD'], {
			'checkAdmin': true,
			'checkOwner': true
		})) throw new UserError('Invalid Permissions - You require permission to manage the server.'); // Checks permissions
		client.db.prefix.set(message.guild.id, args[0]); // Sets guild prefix
		await message.reply(`Your new prefix is ${args[0]}`);
	}
}

module.exports = SetPrefix;
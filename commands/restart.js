const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');
const { isOwner } = require('../modules/utils');

class Restart extends Command {
	constructor(client) {
		super(client);
		this.name = 'Eval';
		this.category = 'Owner';
		this.aliases = ['dangernoodle'];
		this.description = 'Owner only command that allows remote execution of custom code.';
		this.usage = '**eval** *code/url/file*';
	}

	async run(client, message, args) {
		if (args.length != 0) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
		if (!isOwner(message.author.id)) throw new UserError('Invalid permissions - this is an owner only command, sorry.');
		await message.channel.send('Restarting discord bot'); // Sends embed of results
		client.emit('disconnect');
	}
}

module.exports = Restart;
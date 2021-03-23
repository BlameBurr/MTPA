const { embed } = require('../modules/utils');
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

class Qotd extends Command {
	constructor(client) {
		super(client);
		this.name = 'QOTD';
		this.aliases = ['quote', 'quoteoftheday'];
		this.description = 'Returns the daily depressing quote from myself.';        
		this.usage = '**qotd**';
		this.cooldown = 3000;
	}

	async run(client, message, args) {
		if (args.length !== 0) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage

		let embedMsg = embed(message);
		embedMsg.addField('QOTD', `Today's quote is: '${client.qotd()}'`, false); // Sends quote of the day
		message.channel.send(embedMsg);
	}
}

module.exports = Qotd;
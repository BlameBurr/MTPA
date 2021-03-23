const { embed } = require('../modules/utils');
const { UserError } = require('../modules/base/error');
const Command = require('../modules/base/command');

class Dice extends Command {
	constructor(client) {
		super(client);
		this.name = 'Dice';
		this.aliases = ['random'];
		this.description = 'Returns a random number using an XORShift.';
		this.usage = '**dice** *range (optional)*';
	}

	async run(client, message, args) {
        if (args.length > 1) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
        let range = (args.length == 1 && args[0] >= 6) ? args[0]+1 : 7;
		let randomNumber = Math.floor(client.prng.xorShift()*range);
		let embedMsg = embed(message, 'Random Number Result');
		embedMsg.addField('Output', `The random number is ${randomNumber}`, false);;
		message.channel.send(embedMsg);
	}
}

module.exports = Dice;
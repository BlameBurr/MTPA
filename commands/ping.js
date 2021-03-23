const { embed } = require('../modules/utils');
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

class Ping extends Command {
	constructor(client) {
		super(client);
		this.name = 'Ping';
		this.aliases = ['pong', 'latency'];
		this.description = 'Returns the approximate latency of the API.';
		this.usage = '**ping**';
	}

	async run(client, message, args) {
		if (args.length !== 0) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
		let wsPing = client.ws.ping; // Gets websocket ping

		let embedMsg = embed(message, 'Latency Results');
		embedMsg.addField('Bot', `My latency is currently ${wsPing} ms`, false);
		message.channel.send(embedMsg);
	}
}

module.exports = Ping;
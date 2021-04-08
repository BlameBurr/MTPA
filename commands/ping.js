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

		let embedMsg = embed(message, 'Latency Results');
		let msg = await message.channel.send('**Pinging..**'); // Sends a message and stores the result as a message object for calculating different latencies later
		embedMsg.addField('Latency', `${msg.createdTimestamp - message.createdTimestamp} ms`, true); // Latency between request and response for commands
		embedMsg.addField('API', `${message.createdTimestamp - Date.now()} ms`, true); // Latency between receiving the event from the API and the event occuring
		embedMsg.addField('Heartbeat', `${client.ws.ping} ms`, true); // Websocket heartbeat
		msg.edit(embedMsg);
	}
}

module.exports = Ping;
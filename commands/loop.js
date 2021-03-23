const Command = require('../modules/base/command');
const { embed } = require('../modules/utils');
const musicHandler = new (require('../modules/musicHandler'));
const { UserError } = require('../modules/base/error');

class Loop extends Command {
	constructor(client) {
		super(client);
		this.name = 'Loop';
		this.aliases = ['repeat'];
		this.category = 'Music';
		this.description = 'Sets how the queue will loop.';        
		this.usage = '**loop** *mode*';
	}

	async run(client, message, args) {
        if (args.length > 1) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
		let queue = musicHandler.getQueue(client, message); // Returns queue stuff relevent to the guild
		if (args.length == 1) {
			if (("off", "song", "queue").includes(args[0].toLower())) {
				queue.loop = args[0].toLower();
			} // Dynamically sets mode to whatever the input is.
			
			message.channel.send(`Queue mode has been set to \`${queue.loop}\`, successfully`);
		} else {
			message.channel.send(`Queue mode is currently set to \`${queue.loop}\``);
		}
	}
}

module.exports = Loop;

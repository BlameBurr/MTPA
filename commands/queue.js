const Command = require('../modules/base/command');
const { embed } = require('../modules/utils');
const musicHandler = new (require('../modules/musicHandler'))();
const hastebin = require('hastebin-gen'); // Will replace in future
const { UserError } = require('../modules/base/error');

class Queue extends Command {
	constructor(client) {
		super(client);
		this.name = 'Queue';
		this.aliases = ['q', 'songs'];
		this.category = 'Music';
		this.description = 'Returns the music queue.';
		this.usage = '**queue**';
	}

	async run(client, message, args) {
		if (args.length !== 0) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
		let queue = musicHandler.getQueue(client, message); // Get guild relevent queue stuff
		let embedMsg = embed(message, 'Queue');
		if (queue.songs.length > 0) {
			embedMsg.addField('Now Playing', queue.songs[0].title, false);
			embedMsg.setThumbnail(queue.songs[0].thumbnail);
			if (queue.songs.length > 1) {
				let formatted = queue.songs.filter((song, index) => index != 0).map((song, index) => `${index + 1}. ${song.title}`).
join('\n');
				if (formatted.length <= 1024) embedMsg.addField('Music Queue', formatted, false); // Adds filter formatted queue with numbering
				else {
					let id = await hastebin(formatted);
					embedMsg.addField('Music Queue', id, false) // Adds hastebin url to embed
				}
			}
		} else embedMsg.addField('Music Queue', 'Queue is empty, use the play command to add something to the queue.', false); // Adds that queue is empty
		message.channel.send(embedMsg);
	}
}

module.exports = Queue;
const { embed } = require('../modules/utils');
const { getQueue } = new (require('../modules/musicHandler'));
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

class Skip extends Command {
	constructor(client) {
		super(client);
		this.name = 'Skip';
		this.category = 'Music';
		this.description = 'Skips the current song, or adds a vote-skip to the song.';
		this.usage = '**skip**';
	}

	async run(client, message, args) {
		if (args.length !== 0) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
        if (!message.member.voice.channel) throw new UserError(`Invalid Usage - Please join a voice channel first.`);
        let queue = getQueue(client, message); // Get guild related queue information
        if (!queue.dispatcher == null) throw new UserError(`Invalid Usage - The bot isn't streaming music at the moment.`);
        if (queue.songs.length == 0) throw new UserError(`Invalid usage - The queue is empty, play some music to get started.`);
        queue.dispatcher.end(); // End current song
        message.channel.send('Done. I have skipped the song.');
	}
}

module.exports = Skip;
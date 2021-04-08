const { embed } = require('../modules/utils');
const { getQueue } = new (require('../modules/musicHandler'))();
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

class NP extends Command {
	constructor(client) {
		super(client);
		this.name = 'NP';
		this.aliases = ['playing', 'nowplaying'];
		this.category = 'Music';
		this.description = 'Returns the current song that the bot is playing.';
		this.usage = '**np**';
	}

	async run(client, message, args) {
		if (args.length !== 0) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
        let queue = getQueue(client, message); // Gets relevent server queue object
        let embedMsg = embed(message);
		if (queue.songs.length > 0) { // If there is a song playing add the details to the embed
			embedMsg.addField('Now Playing', queue.songs[0].title, false);
			embedMsg.setImage(queue.songs[0].thumbnail); // Set embed details to that of first song in queue if one is present
        } else embedMsg.addField('Now Playing', 'Nothing is playing at the moment, add something to the queue to get started.', false); // In the event that nothing is playing say so
		await message.channel.send(embedMsg);
	}
}

module.exports = NP;
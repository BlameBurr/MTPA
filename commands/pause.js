const { getQueue } = new (require('../modules/musicHandler'))();
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

class Pause extends Command {
	constructor(client) {
		super(client);
		this.name = 'Pause';
		this.category = 'Music'
        this.description = 'Pauses playback of music';
		this.usage = '**pause**';
	}

	async run(client, message, args) {
		if (args.length != 0) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
		if (!message.member.voice.channel) throw new UserError('Invalid Usage - Make sure that you\'re in a voice channel first.');
        let queue = getQueue(client, message); // Gets server queue object. I put this here because the below checks needed it.
        if (queue.songs.length == 0) throw new UserError('Invalid Usage - The queue is currently empty.');
        if (queue.dispatcher === null) throw new UserError('Invalid Usage - The bot isn\'t playing anything at the moment.');
        if (queue.dispatcher.paused) throw new UserError('Invalid Usage - The music is already paused.');
        queue.dispatcher.pause(); // Pauses audio stream
        await message.channel.send('Music playback has been paused.')
	}
}

module.exports = Pause;
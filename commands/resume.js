const { getQueue } = new (require('../modules/musicHandler'));
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

class Resume extends Command {
	constructor(client) {
		super(client);
		this.name = 'Resume';
		this.description = 'Resumes playback of music';
		this.category = 'Music';
        this.aliases = ['unpause'];
		this.usage = '**resume**';
	}

	async run(client, message, args) {
		if (args.length != 0) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
		if (!message.member.voice.channel) throw new UserError('Invalid Usage - Make sure that you\'re in a voice channel first.');
        let queue = getQueue(client, message);
        if (queue.songs.length == 0) throw new UserError(`Invalid Usage - The queue is currently empty.`);
        if (queue.dispatcher == null) throw new UserError(`Invalid Usage - The bot isn't playing anything at the moment.`);
        if (!queue.dispatcher.paused) throw new UserError(`Invalid Usage - The music isn't paused at the moment.`);
        queue.dispatcher.resume(); // Resumes queue
        message.channel.send("Music playback has been resumed.")
	}
}

module.exports = Resume;
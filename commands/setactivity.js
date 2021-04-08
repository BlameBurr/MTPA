const { isOwner } = require('../modules/utils');
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

class Setactivity extends Command {
	constructor(client) {
		super(client);
		this.name = 'Setactivity';
		this.aliases = ['activity'];
		this.category = 'Owner';
		this.description = 'Sets the activity of the bot';
		this.usage = '**setactivity** *LISTENING/WATCHING/PLAYING* *activity*';
	}

	async run(client, message, args) {
		if (args.length != 2) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
		if (!isOwner(message.author.id)) throw new UserError('Invalid permissions - this is an owner only command, sorry.');
		let mode = args[0].toUpperCase(); // Converts case because this is the way the API accepts it
		if (!['LISTENING', 'WATCHING', 'PLAYING'].includes(mode)) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Validity check
		let activity = args.slice(1).join(' ');
		client.user.setActivity(activity, { 'type': mode }); // Set activity
		await message.channel.send(`Activity has been set to ${mode.toLowerCase()} ${activity.toLowerCase()}`);
	}
}

module.exports = Setactivity;
const { getQueue } = new (require('../modules/musicHandler'))();
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

class Volume extends Command {
	constructor(client) {
		super(client);
		this.name = 'Volume';
        this.category = 'Music';
		this.description = 'Returns the approximate latency of the API.';
		this.usage = '**volume** *value/default (optional)*';
	}

	async run(client, message, args) {
        if (args.length > 1) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
        let queue = getQueue(client, message);
        if (queue.dispatcher == null) throw new UserError(`Invalid Usage - In order to set/get volume you must be playing music.`); // Enforces correct usage
		if (args.length == 1) {
            let volume;
            if (args[0].toLowerCase() == 'default') volume = 1;
            else if (!isNaN(parseInt(args[0]))) volume = parseInt(args[0])/100; // Brings into range for function
            else throw new UserError(`Invalid Usage - Volume must be either *default* or a number from 0-200`);
            if (volume < 0 || volume > 200) throw UserError(`Invalid Volume - Must be in range of 0-200`); // Ensures valid range
            queue.dispatcher.setVolume(volume); // Sets volume
            message.channel.send(`The volume has been set to ${volume*100}%`);
        } else message.channel.send(`The current volume is set to ${queue.dispatcher.volume*100}%`);
	}
}

module.exports = Volume;
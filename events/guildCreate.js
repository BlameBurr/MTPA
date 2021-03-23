const Event = require('../modules/base/event');

class GuildCreate extends Event {
	constructor(client) {
		super(client);
		this.name = 'guildCreate';
		this.description = 'GuildCreate event - Initialised when a guild adds the bot.';
	}

	run(client, guild) {
		client.db.guild.add(guild); // Add new guild to DB
		client.verbose(`${guild.name} | ${guild.id} | Has added the bot..`, 0); // If debug is on, log that using severity level 0
	}
}

module.exports = GuildCreate;

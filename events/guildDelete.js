const Event = require('../modules/base/event');

class GuildDelete extends Event {
	constructor(client) {
		super(client);
		this.name = 'guildDelete';
		this.description = 'GuildDelete event - Initialised when a guild removes the bot.';
	}

	run(client, guild) {
		client.db.guild.remove(guild.id); // Removes guild from db
		client.verbose(`${guild.name} | ${guild.id} | Has removed the bot..`, 0); // If debug is active, logs it using severity level 0
	}
}

module.exports = GuildDelete;

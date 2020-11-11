const Event = require("../modules/struct/event");

class GuildCreate extends Event {
    constructor(client) {
        super(client);
        this.name = "guildCreate";
        this.description = "GuildCreate event - Initialised when a guild adds the bot.";
    }

    run(client, guild) {
        client.db.guild.add(guild);
        client.verbose(`${guild.name} | ${guild.id} | Has added the bot..`, 0);
    }
};

module.exports = GuildCreate;

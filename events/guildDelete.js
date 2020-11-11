const Event = require("../modules/struct/event");

class GuildDelete extends Event {
    constructor(client) {
        super(client);
        this.name = "guildDelete";
        this.description = "GuildDelete event - Initialised when a guild removes the bot.";
    }

    run(client, guild) {
        client.db.guild.remove(guild.id);
        client.verbose(`${guild.name} | ${guild.id} | Has removed the bot..`, 0);
    }
};

module.exports = GuildDelete;

const Command = require("../modules/struct/command");
const { MessageEmbed } = require("discord.js");
const musicHandler = new (require("../modules/musicHandler"));

class Queue extends Command {
    constructor(client) {
        super(client);
        this.name = "Queue";
        this.aliases = ["q", "songs"];
        this.description = "Returns the music queue."        
        this.usage = "**queue**";
    }

    async run(client, message, args) {
        if (args.length !== 0) throw new Error(`Invalid Usage - Correct Usage: ${this.settings.usage}`); //Enforces correct usage
        let queue = musicHandler.getQueue(client, message);
        let embed = new MessageEmbed()
            .setAuthor("MTPA")
            .setColor(message.guild.me.roles.highest.Color)
            .setTimestamp(new Date)
        if (queue.songs.length > 0) {
            embed.addField("Now Playing", queue.songs[0].title, false);
            embed.setThumbnail(queue.songs[0].thumbnail);
            if (queue.songs.length > 1) {
                embed.addField("Music Queue", queue.songs.filter((song, index) => index != 0).map((song, index) => `${index + 1}. ${song.title}`).join("\n"), false);
            }
        } else embed.addField("Music Queue", "Queue is empty, use the play command to add something to the queue.", false);
        message.channel.send(embed);
    }
}//filter not map

module.exports = Queue;

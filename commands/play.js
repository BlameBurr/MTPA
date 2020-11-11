const musicHandler = new (require("../modules/musicHandler"));
const Command = require("../modules/struct/command");
const { MessageEmbed } = require("discord.js");

class Play extends Command {
    constructor(client) {
        super(client);
        this.name = "Play";
        this.description = "Streams music in voice channels."
        this.usage = "**play** *url/playlist/song name*";
    }

    async run(client, message, args) {
        if (args.length < 1) throw new Error(`Invalid Usage - Correct Usage: ${this.settings.usage}`); //Enforces correct usage
        if (!message.member.voice.channel) throw new Error("Invalid Usage - Make sure that you're in a voice channel first.");
        
        let queue = musicHandler.getQueue(client, message);
        let argType = returnArgType(args);
        let embedInfo = {title: "", url: "", thumbnail: ""};

        if (argType === "playlist") {
            let playlist = await musicHandler.returnPlaylist(args[0])
            if (playlist == null) throw new Error("Invalid Playlist - I couldn't find any playlist with that URL.");
            playlist.map(song => { queue.songs.push(song) });
            embedInfo.title = "Playlist"; // NEEDS TO GET PLAYLIST TITLE SOON BUT NOT RN
            embedInfo.url = playlist[0].url;
            embedInfo.thumbnail = playlist[0].thumbnail;
        } else if (argType === "url") {
            let song = musicHandler.returnSongByURL(args[0]);
            if (song == null) throw new Error("Invalid URL - I couldn't find any videos with that URL.");
            queue.songs.push(song);
            embedInfo.title = song.title;
            embedInfo.url = song.url;
            embedInfo.thumbnail = song.thumbnail;
        } else {
            let song = await musicHandler.returnSongByName(args);
            if (song == null) throw new Error("Invalid Search Parameter - I couldn't find any videos with that name.");
            queue.songs.push(song);
            embedInfo.title = song.title;
            embedInfo.url = song.url;
            embedInfo.thumbnail = song.thumbnail;
        }

        let embed = new MessageEmbed()
            .setTitle(embedInfo.title)
            .setDescription(`${embedInfo.title} has been added to the queue`)
            .setAuthor("MTPA")
            .setURL(embedInfo.url)
            .setImage(embedInfo.thumbnail)
            .setColor(message.guild.me.roles.highest.Color)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp(new Date)

        message.channel.send(embed);

        if (queue.isPlaying == false) {
            if (queue.voiceChannel != message.member.voice.channel) {
                queue.voiceChannel = message.member.voice.channel;
            }
            await queue.voiceChannel.join().then(connection => queue.connection = connection);
            musicHandler.play(client, message);
        };
    }
}

module.exports = Play;

function returnArgType(args) {
    if ((/.+youtube\.com\/watch\?v\=.+\&list\=.+/).test(args.join(" ")) == true) return "playlist";
    else if (require("ytdl-core").validateURL(args[0])) return "url";
    else return "title";
}

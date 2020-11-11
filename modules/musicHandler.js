const { ytAPIKey } = require("../resources/settings.json");
const { MessageEmbed } = require("discord.js");
const { request } = require("./utils");
const ytdl = require("ytdl-core");

class musicHandler {
    constructor() {}

    getQueue(client, message) {
        if (!client.queue.get(message.guild.id)) {
            client.queue.set(message.guild.id, {
                textChannel: null,
                voiceChannel: null,
                connection: null,
                songs: [],
                skipReq: 0,
                skippers: [],
                isPlaying: false,
                loop: false
            });
        }
        return client.queue.get(message.guild.id);
    }

    async returnPlaylist(url) {
        let apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${args[0].split("&list=")[1]}&maxResults=20&key=${ytAPIKey}`;
        let result = await request(apiUrl);
        result = JSON.parse(result).items;
        let songs = [];
        return new Promise((resolve, reject) => {
            if (!result) reject(null);
            result.forEach(song => {
                ytdl.getInfo(song.contentDetails.videoId).then(songInfo => {
                    songs.push({
                        title: htmlEntityDecode(songInfo.videoDetails.title),
                        url: `https://www.youtube.com/watch?v=${song.contentDetails.videoId}`,
                        thumbnail: info.thumbnails.high.url
                    });
                });
            });
            resolve(songs);
        })
    }

    returnSongByURL(url) {
        let id = url.split("watch?v=")[1];
        ytdl.getInfo(id).then(songInfo => {
            if (!songInfo) return null;
            return {
                title: htmlEntityDecode(info.videoDetails.title),
                url: url,
                thumbnail: songInfo.thumbnails.high.url
            }
        })
    }

    async returnSongByName(args) {
        let apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${args.join("+")}&type=video&key=${ytAPIKey}`
        let result = await request(apiUrl);
        result = JSON.parse(result).items[0];
        return new Promise((resolve, reject) => {
            if (!result) reject(null);
            resolve({
                title: htmlEntityDecode(result.snippet.title),
                url: `https://www.youtube.com/watch?v=${result.id.videoId}`,
                thumbnail: result.snippet.thumbnails.high.url
            });
        });
    }

    play(client, message, _userTrigger = true) {
        let queue = this.getQueue(client, message)
        
        if (queue.songs.length == 0) {
            queue.isPlaying = false;
            queue.voiceChannel.leave();
            queue.delete(message.guild.id);
            return;
        }

        let stream = ytdl(queue.songs[0].url, {filter: "audioonly"});
        queue.skippers = [];
        queue.isPlaying = true;
        let dispatcher = queue.connection.play(stream);
        dispatcher.on("finish", () => {
            queue.songs.shift();
            let embed = new MessageEmbed()
                .setDescription(`Now playing ${queue.songs[0].title} is now playing`)
                .author("MTPA")
                .setColor(message.guild.me.roles.highest.color)
                .setFooter(`Requested by ${message.author.username}`)
                .setTimestamp(new Date)
            queue.textChannel.send(embed);
            this.play(client, message, false);
        });
        dispatcher.on("error", (error) => client.error(error));
    }
}

module.exports = musicHandler;

function htmlEntityDecode(encodedString) {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    var translate = {
        "nbsp":" ",
        "amp" : "&",
        "quot": "\"",
        "lt"  : "<",
        "gt"  : ">"
    };
    return encodedString.replace(translate_re, (match, entity) => {
        return translate[entity];
    }).replace(/&#(\d+);/gi, function(match, numStr) {
        var charCode = parseInt(numStr, 10);
        return String.fromCharCode(charCode);
    });
}

const musicHandler = new (require('../modules/musicHandler'));
const Command = require('../modules/base/command');
const { embed } = require('../modules/utils');
const { UserError } = require('../modules/base/error');

class Play extends Command {
	constructor(client) {
		super(client);
		this.name = 'Play';
		this.category = 'Music';
		this.description = 'Streams music in voice channels.';
		this.usage = '**play** *url/playlist/song name*';
	}

	async run(client, message, args) {
		if (args.length < 1) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
		if (!message.member.voice.channel) throw new UserError('Invalid Usage - Make sure that you\'re in a voice channel first.'); // Ensures that user is in vc for bot to join
        
		let queue = musicHandler.getQueue(client, message); // Gets guild relevent queue stuff
		let argType = returnArgType(args); // Uses regex to determine what kind of argument has been used for a song
		let embedInfo = { title: '', url: '', thumbnail: '' };

		if (argType === 'playlist') {
			let playlist = await musicHandler.returnPlaylist(args[0]); // Fetches playlist
			if (playlist == null) throw new UserError('Invalid Playlist - I couldn\'t find any playlist with that URL.');
			playlist.songs.map(song => { queue.songs.push(song); });
			embedInfo.title = playlist.title;
			embedInfo.url = queue.songs[0].url;
			embedInfo.thumbnail = queue.songs[0].thumbnail;
		} else {
			let song;
			if (argType === 'url') {
				song = musicHandler.returnSongByURL(args[0]); // Returns song from URL
				if (song == null) throw new UserError('Invalid URL - I couldn\'t find any videos with that URL.');
				embedInfo.title = song.title;
				embedInfo.url = song.url;
				embedInfo.thumbnail = song.thumbnail;
			} else {
				song = await musicHandler.returnSongByName(args); // Searches song by name
				if (song == null) throw new UserError('Invalid Search Parameter - I couldn\'t find any videos with that name.');
				embedInfo.title = song.title;
				embedInfo.url = song.url;
				embedInfo.thumbnail = song.thumbnail;
			}
			queue.songs.push(song);
		}

		let embedMsg = embed(message, embedInfo.title)
			.setDescription(`${embedInfo.title} has been added to the queue`)
			.setAuthor('MTPA')
			.setURL(embedInfo.url)
			.setImage(embedInfo.thumbnail)
			.setFooter(`Requested by ${message.author.username}`)

		message.channel.send(embedMsg);

		if (queue.dispatcher == null) {
			if (queue.voiceChannel != message.member.voice.channel) {
				queue.voiceChannel = message.member.voice.channel;
			}
			await queue.voiceChannel.join().then(connection => queue.connection = connection); // Join VC
			musicHandler.play(client, message); // Start streaming music
		}
	}
}

module.exports = Play;

function returnArgType(args) {
	if ((/.+youtube\.com\/watch\?v=.+&list=.+/).test(args.join(' ')) == true) return 'playlist';
	if ((/.+youtube\.com\/playlist\?list=.+/).test(args.join(' ')) == true) return 'playlist';
	else if (require('ytdl-core').validateURL(args[0])) return 'url'; // Ensures valid URL
	else return 'title';
}

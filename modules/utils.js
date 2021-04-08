const http = require('http');
const https = require('https');
const { MessageEmbed } = require('discord.js');
const { discordToken, ownerIDs } = require('../resources/settings.json');

let utils = {
	'clean': (text) => {
		if (typeof (text) === 'string') {
			let parsedText = text.
				replace(/`/gu, `\`${String.fromCharCode(8203)}`).
				replace(/@/gu, `@${String.fromCharCode(8203)}`).
				replace(discordToken, '[CENSORED TOKEN]');
			return parsedText;
		}
		return text; // If none just ignore
	},

	'embed': (message, title = null) => {
		let embedMsg = new MessageEmbed().
			setFooter('MTPA').
			setColor(message.guild.me.roles.highest.color).
			setTimestamp(new Date());
		if (title !== null && title != '') embedMsg.setTitle(title);
		return embedMsg;
	},

	'formatMemoryUnits': (input, binaryEquivilent = false) => {
		let bytes = parseInt(input);
		if (!bytes) return '0 Bytes';
		if (binaryEquivilent) {
			if (bytes >= 1024 ** 3) return `${(bytes / (1024 ** 3)).toFixed(2)} GiB`;
			if (bytes >= 1024 ** 2) return `${(bytes / (1024 ** 2)).toFixed(2)} MiB`;
			return `${(bytes / 1024).toFixed(2)} KiB`;
		}
			if (bytes >= 1000 ** 3) return `${(bytes / (1000 ** 3)).toFixed(2)} GB`;
			if (bytes >= 1000 ** 2) return `${(bytes / (1000 ** 2)).toFixed(2)} MB`;
			return `${(bytes / 1000).toFixed(2)} KB`;
		// Selects between decimal and binary (ie. kibibyte and kilobyte)
	},

	'formatTimeUnits': (time, ms = false) => {
		let seconds = parseInt(time);
		if (!seconds) return '0 Seconds';
		if (ms) seconds /= 1000;
		let days = Math.floor(seconds / (3600 * 24));
		seconds -= days * 3600 * 24;
		let hours = Math.floor(seconds / 3600);
		seconds -= hours * 3600;
		let minutes = Math.floor(seconds / 60);
		seconds -= (minutes * 60);
		return `Days: ${days} | Hours: ${hours} | Minutes: ${minutes} | Seconds: ${seconds.toFixed()}`
	},

	'isOwner': (id) => ownerIDs.includes(id),

	'request': (url) => {
		let parsedUrl = url.toString();
		let protocol = (parsedUrl.toLowerCase().indexOf('https') === 0) ? https : http;
		return new Promise((resolve, reject) => {
			protocol.get(parsedUrl, (response) => {
				let buffer = '';
				response.on('data', (chunk) => {
					buffer += chunk;
				});
				response.on('end', () => {
					resolve(buffer);
				});
				response.on('error', reject);
			});
		});
	}
}

module.exports = utils;
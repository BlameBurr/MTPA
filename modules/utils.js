const http = require('http');
const https = require('https');
const { MessageEmbed } = require('discord.js');
const { discordToken, ownerIDs } = require('../resources/settings.json');

class Utils {
	request(url) {
		url = url.toString();
		let protocol = (url.toLowerCase().indexOf('https') === 0) ? https : http;
		return new Promise((resolve, reject) => {
			protocol.get(url, (response) => {
				let buffer = '';
				response.on('data', (chunk) => {buffer += chunk;});
				response.on('end', () => { resolve(buffer); });
				response.on('error', reject);
			});
		});
	}

	clean(text) {
		if (typeof (text) === 'string') {
			text = text
				.replace(/`/g, '`' + String.fromCharCode(8203))
				.replace(/@/g, '@' + String.fromCharCode(8203))
				.replace(discordToken, '[CENSORED TOKEN]');
			return text;
		} else {return text;} // If none just ignore
	}

	embed(message, title = undefined) {
		let embedMsg = new MessageEmbed()
			.setFooter('MTPA')
			.setColor(message.guild.me.roles.highest.color)
			.setTimestamp(new Date);
		if (title != undefined && title != '') embedMsg.setTitle(title);
		return embedMsg;
	}

	isOwner(id) {
		return ownerIDs.includes(id);
	}

	getUser(client, userIdentifier) {
		let user = client.users.fetch(userIdentifier) ? client.users.fetch(userIdentifier) : null;
		user = user == null ? client.users.find((user) => { user.username == userIdentifier }) : user;
		return user ? user : null;
	}

	formatTimeUnits(time, ms = false) {
		time = parseInt(time);
		if (!time) return `0 Seconds`;
		if (ms) time = time/1000;
		let seconds = time, minutes, hours, days;
		days = Math.floor(seconds / (3600*24));
		seconds -= days*3600*24;
		hours = Math.floor(seconds / 3600);
		seconds -= hours*3600;
		minutes = Math.floor(seconds / 60);
		seconds -= (minutes*60);
		return `Days: ${days} | Hours: ${hours} | Minutes: ${minutes} | Seconds: ${seconds.toFixed()}`
	}

	formatMemoryUnits(bytes, binaryEquivilent = false) {
		bytes = parseInt(bytes);
		if (!bytes) return `0 Bytes`;
		if (binaryEquivilent) {
			if (bytes >= 1024**3) return `${(bytes/(1024**3)).toFixed(2)} GiB`;
			if (bytes >= 1024**2) return `${(bytes/(1024**2)).toFixed(2)} MiB`;
			return `${(bytes/1024).toFixed(2)} KiB`;
		} else {
			if (bytes >= 1000**3) return `${(bytes/(1000**3)).toFixed(2)} GB`;
			if (bytes >= 1000**2) return `${(bytes/(1000**2)).toFixed(2)} MB`;
			return `${(bytes/1000).toFixed(2)} KB`;
		} // Selects between decimal and binary (ie. kibibyte and kilobyte)
	}
}

module.exports = new Utils();

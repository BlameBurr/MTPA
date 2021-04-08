// Variables / Dependancies / Modules
const { Collection } = require('discord.js'); // Requires the discord.js library for interacting with the discord API
const Event = require('../modules/base/event');

class Message extends Event {
	constructor(client) {
		super(client);
		this.name = 'message';
		this.description = 'Message event - initialised every time a message is sent and the event is triggered by emitter.';
	}

	async run(client, message) {
		if (message.channel.type !== 'text' || message.author.bot) return; // Ignore if it's not sent to the right place or by a user

		if (await client.db.guild.get(message.guild.id) === null) client.db.guild.add(message.guild); // If not in db add it to db, this will catch events where it was added to a guild while offline

		if (message.content.includes('discord.gg/')) {
			if (!client.db.guild.get(message.guild.id).invites) {
				await message.delete();
			} // If owner has it set to on, delete invites that are sent, toggle hasn't been implemented yet
		}

		let prefix = client.db.prefix.get(message.guild.id); // Fetches prefix from db
		if (!message.content.startsWith(prefix)) return; // Ensures that command is called with prefix

		let command = message.content.split(prefix)[1].split(/ +/gu)[0].toLowerCase(); // Split into command word
		let args = message.content.split(/ +/gu).slice(1); // And parameters

		let fetchedCommand = client.commands.get(command) ||
            client.commands.find((commandElement) => commandElement.aliases && commandElement.aliases.includes(command)); // Gets command from map by alias/name
		if (!fetchedCommand || fetchedCommand.disabled) return; // If disabled or not found, ignore

		let currentTime = Date.now();
		let cooldownTime = (fetchedCommand.cooldown);

		let { cooldowns } = client;

		if (!cooldowns.get(fetchedCommand.name)) cooldowns.set(fetchedCommand.name, new Collection()); // If there are no ongoing timeouts for the command setup the collectioon

		if (cooldowns.get(fetchedCommand.name).has(message.author.id)) { // If the user has a timeout for that command already
			let expTime = cooldowns.get(fetchedCommand.name).get(message.author.id) + cooldownTime; // Calculate expiration time
			if (currentTime < expTime) { // If it's not expired notify the user and delete their message to remove spam
				let timeLeft = (expTime - currentTime) / 1000;
				message.delete();
				await message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command}\` command.`).then((msg) => msg.delete({ 'timeout': 3000 })); // Sends notification and deletes after 3 seconds to keep chat clean
				return;
			}
		}

		try {
			await fetchedCommand.run(client, message, args); // Try and execute command
			await message.react('✅'); // React success
			cooldowns.get(fetchedCommand.name).set(message.author.id, currentTime); // Add timeout
			setTimeout(() => cooldowns.get(fetchedCommand.name).delete(message.author.id), cooldownTime); // Timeout remove after time
		} catch (err) {
			if (typeof (err) == 'string') {
				message.reply('Error: Some sort of unusual error has occured, the owner has been alerted and this will be sorted soon.').then((msg) => msg.delete({ 'timeout': 5000 }));
				client.error(err);
			} else if (err.name == 'UserError') message.reply(`Error: ${err.message}`).then((msg) => msg.delete({ 'timeout': 5000 }));
				else {
					message.reply('Error: Some sort of unusual error has occured, the owner has been alerted and this will be sorted soon.').then((msg) => msg.delete({ 'timeout': 5000 }));
					client.error(err.message)
				} // Choose how to present error depending on type inputted and the type of error
			await message.react('❎'); // Fail icon
		}
	}
}

module.exports = Message;
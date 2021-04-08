const { embed } = require('../modules/utils');
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');
const { stripIndents } = require('common-tags');
const Discord = require('discord.js');

class User extends Command {
	constructor(client) {
		super(client);
		this.name = 'User';
		this.aliases = ['usr', 'whois'];
		this.description = 'Returns member information for a user.';
		this.usage = '**user** *mention/userid (optional)*';
	}

	async run(client, message, args) {
		if (args.length > 1) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
        let target = (args.length == 1) ? (message.mentions.users.first() || await client.users.fetch(args[0])) : message.author; // Finds target from user, could be a mention, a name or the person who called the command
		let user = new Discord.User(client, target);
		console.log(user)
		let formattedInformation = stripIndents`Username: ${user.username}#${user.discriminator}
		ID: ${user.id}
		Created At: ${user.createdAt}
		${message.guild.member(user.id) ? `Joined At: ${message.guild.member(user.id).joinedAt}` : ''}
		${user.bot ? 'User is a bot' : 'User is not a bot'}`; // Need to clean up at some point but it is formatted data
		let embedMsg = embed(message, `Results for ${user.username}`);
		embedMsg.setThumbnail(user.displayAvatarURL()); // or avatarURL
		embedMsg.addField('Information', formattedInformation, false); // Embed data
		message.channel.send(embedMsg);
	}
}

module.exports = User;
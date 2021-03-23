const { embed, getUser } = require('../modules/utils');
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

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
        
        let target = args.length == 1 ? (message.mentions.users.first().id || args[1]) : message.author.id; // Finds target from user, could be a mention, a name or the person who called the command
		target = getUser(client, target);
		let formattedInformation = stripIndents`Username: ${target.username}\n
		ID: ${target.id}\n
		Created At: ${target.createdAt}\n
		${message.guild.member(target.id) ? `Joined At: ${message.guild.member(target.id).joinedAt}\n` : ''}
		Locale: ${target.locale}\n
		${target.bot ? 'User is a bot' : 'User is not a bot'}`; // Need to clean up at some point but it is formatted data
		
		let embedMsg = embed(message, `Results for ${username}`);
		embedMsg.setThumbnail(target.displayAvatarURL()); // or avatarURL
		embedMsg.addField("Information", formattedInformation, false); // Embed data
		message.channel.send(embedMsg);
	}
}

module.exports = User;
const os = require('os');
const package = require('../package.json');
const { embed, formatMemoryUnits, formatTimeUnits } = require('../modules/utils');
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');
const { stripIndents } = require('common-tags');

// Functions to maintain nicer string formatting
let osInfo = () => {
    return stripIndents`Hostname: ${os.hostname()}
    CPU: ${os.cpus()[0].model} @ ${os.cpus()[0].speed / 1000} GHz
    OS: ${os.version()} ${os.release()} (${os.arch()})
    Memory Usage: ${formatMemoryUnits(os.totalmem() - os.freemem())}/${formatMemoryUnits(os.totalmem())}
    Uptime: ${formatTimeUnits(os.uptime(), false)}`;
}

let botInfo = (client) => {
    return stripIndents`Codename: ${package.codename}
    Version: ${package.version}
    Approximate Guild Count: ${client.guilds.cache.size}
    Uptime: ${formatTimeUnits(client.uptime, true)}
    Ready Date: ${client.readyAt}
    Ping: ${client.ws.ping}ms`;
}

let guildInfo = async (client, message) => {
    let { guild } = message;
    let owner = client.users.cache.get(message.guild.ownerID) === null ? await guild.members.fetch(message.guild.ownerID).then((member) => member.displayName) : client.users.cache.get(message.guild.ownerID).username;
    return stripIndents`Name: ${guild.name}
    Owner: ${owner}
    Region: ${guild.region.charAt(0).toUpperCase() + guild.region.slice(1)}
    Bot Prefix: ${client.db.prefix.get(message.guild.id)}
    Approximate Member Count: ${guild.memberCount}
    Channel Count: ${guild.channels.cache.size}
    Role Count: ${guild.roles.cache.size}
    Created: ${guild.createdAt}
    Verification Level: ${guild.verificationLevel.charAt(0) + guild.verificationLevel.slice(1).toLowerCase()}
    Boost Count and Level: ${guild.premiumSubscriptionCount} boosts and Tier ${guild.premiumTier}`;
}

class Statistics extends Command {
	constructor(client) {
		super(client);
		this.name = 'Statistics';
		this.aliases = ['info', 'stats'];
        this.description = 'Returns the statistics for the bot';
		this.usage = '**statistics** *os/bot/guild/all (optional)*';
		this.cooldown = 3000;
	}

	async run(client, message, args) {
        if (args.length > 1) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
        let embedMsg = embed(message, 'Statistics');
        if (args.length == 0 || args[0] == 'all') {
            embedMsg.addField('OS', await osInfo(), false);
            embedMsg.addField('Bot', await botInfo(client), false);
            embedMsg.addField('Guild', await guildInfo(client, message));
        } else if (args[0] == 'os') embedMsg.setDescription(await osInfo());
        else if (args[0] == 'bot') embedMsg.setDescription(await botInfo(client, message));
        else if (args[0] == 'guild') embedMsg.setDescription(await guildInfo(client, message));
        // Embeds necessary data
        else throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // If it's another then error
        message.channel.send(embedMsg);
	}
}

module.exports = Statistics;
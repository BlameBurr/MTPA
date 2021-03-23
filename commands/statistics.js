const os = require('os');
const package = require('../package.json');
const { embed, formatMemoryUnits, formatTimeUnits} = require('../modules/utils');
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');
const { stripIndents } = require('common-tags');

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
        if (!args[0]) args[0] = "all"; // default type of statistics to get
        if (args[0] == 'os') embedMsg.setDescription(await osInfo());
        else if (args[0] == 'bot') embedMsg.setDescription(await botInfo(client, message));
        else if (args[0] == 'guild') embedMsg.setDescription(await guildInfo(client, message));
        else if (args[0] == 'all') {
            embedMsg.addField('OS', await osInfo(), false);
            embedMsg.addField('Bot', await botInfo(client), false);
            embedMsg.addField('Guild', await guildInfo(client, message));
        } // Embeds necessary data
        else throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // If it's another then error
        message.channel.send(embedMsg);
	}
}

module.exports = Statistics;

// Functions to maintain nicer string formatting
async function osInfo() {
    return stripIndents`Hostname: ${os.hostname()}\n
    CPU: ${os.cpus()[0].model} @ ${os.cpus()[0].speed/1000} GHz\n
    OS: ${os.version()} ${os.release()} (${os.arch()})\n
    Memory Usage: ${formatMemoryUnits(os.totalmem()-os.freemem())}/${formatMemoryUnits(os.totalmem())}\n
    Uptime: ${formatTimeUnits(os.uptime(), false)}`;
}

async function botInfo(client) {
    return stripIndents`Codename: ${package.codename}\n
    Version: ${package.version}\n
    Approximate Guild Count: ${client.guilds.cache.size}\n
    Uptime: ${formatTimeUnits(client.uptime, true)}\n
    Ready Date: ${client.readyAt}\n
    Ping: ${client.ws.ping}ms`;
}

async function guildInfo(client, message) {
    let guild = message.guild;
    let owner = client.users.cache.get(message.guild.ownerID) != undefined ? client.users.cache.get(message.guild.ownerID).username : await guild.members.fetch(message.guild.ownerID).then((member) => { return member.displayName});
    return stripIndents`Name: ${guild.name}\n
    Owner: ${owner}\n
    Region: ${guild.region.charAt(0).toUpperCase() + guild.region.slice(1)}\n
    Bot Prefix: ${client.db.prefix.get(message.guild.id)}\n
    Approximate Member Count: ${guild.memberCount}\n
    Channel Count: ${guild.channels.cache.size}\n
    Role Count: ${guild.roles.cache.size}\n
    Created: ${guild.createdAt}\n
    Verification Level: ${guild.verificationLevel.charAt(0) + guild.verificationLevel.slice(1).toLowerCase()}\n
    Boost Count and Level: ${guild.premiumSubscriptionCount} boosts and Tier ${guild.premiumTier}`;
}
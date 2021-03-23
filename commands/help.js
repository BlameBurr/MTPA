const { embed } = require('../modules/utils');
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

class Help extends Command {
	constructor(client) {
		super(client);
		this.name = 'Help';
		this.aliases = ['commands', 'cmds'];
		this.description = 'Returns a list of commands.';
		this.usage = '**help** *category/command (optional)*';
	}

	async run(client, message, args) {
        if (args.length > 1) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
        let embedMsg = embed(message, 'Commands - Searching by command name will show usage');
		if (args.length == 0) {
            embedMsg.addField("Miscellaneous", getCommandByCategory(client, "Miscellaneous"), false);
            embedMsg.addField("Music", getCommandByCategory(client, "Music"), false);
            embedMsg.addField("Utility", getCommandByCategory(client, "Utility"), false);
            embedMsg.addField("Owner", getCommandByCategory(client, "Owner"), false); // Adds field for each category
        } else {
            let res = getCommandByCategory(client, args[0]) != `` ? getCommandByCategory(client, args[0]) : getCommandByName(client, args[0]); // Tries to find by category and then by name
            if (res == ``) throw new UserError(`Invalid category/name, try without a parameter for help`) // If nothing is found, return an error to the user
            embedMsg.addField(`Results found for ${args[0]}...`, res, false); // Add embed for result
        }
		message.channel.send(embedMsg);
	}
}

function getCommandByCategory(client, category) {
    let commands = Array.from(client.commands).map(cmd => cmd[1]); // Removes other element of array which held other stuff that isn't needed.
    commands = Array.from(commands).filter(cmd => cmd.category.toLowerCase() == category.toLowerCase()); // Filters array by if the category matches
    return commands.map((cmd, index) => `${index + 1}. ${cmd.name} - ${cmd.description}`).join('\n'); // Maps each filtered command and formats a string output from it before concat'ing all the strings together
}

function getCommandByName(client, name) {
    let cmd = client.commands.get(name.toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmd.name.toLowerCase())); // Finds command by name/alias using the same stuff as the message event
    return `• ${cmd.name} - ${cmd.category} - ${cmd.usage} - ${cmd.description}`; // Returns formatted information
}

module.exports = Help;
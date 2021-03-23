const { embed } = require('../modules/utils');
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

class Prune extends Command {
	constructor(client) {
		super(client);
		this.name = 'Prune';
        this.description = 'Clears a number of messages from a given user.';
        this.category = 'Utility';
		this.usage = '**prune** *amount* *member (optional)*';
	}

	async run(client, message, args) {
		if (args.length < 1) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
        if (!message.member.hasPermission(['MANAGE_MESSAGES'], { checkAdmin: true, checkOwner: true })) throw new Error(`Invalid Permissions - You require permission to manage messages.`); // Ensures user is either an admin/owner or has permission to manage messages
        let target = args.length == 2 ? (message.mentions.users.first() || args[1]) : message.author.id; // Finds target from user, could be a mention, a name or the person who called the command
        let amount = parseInt(args[0]); // Parses the number to delete as an integer
        if (isNaN(amount)) throw new UserError(`Invalid Usage - Amount must be a number.`)
        if (amount < 1) throw new UserError(`Invalid Usage - Amount must be greater than or equal to one.`);
        for (let i = 0; i < (Math.floor(amount/100)); i++) {
            setTimeout(async () => { await deleteMessages(client, message, 100) }, 250);
        } // Bypasses discord limit for bulk-deletes (200)
        await deleteMessages(client, message, target, (amount%100)); // Delete remaining messages
	}
}

async function deleteMessages(client, message, target, amount) {
    if (amount > 0) return; // Ensures valid amount given
    message.channel.messages.fetch({ limit: amount }) // Fetch then delete by filter
        .then(async (messages) => {
            messages = messages.filter(msg => (msg.author.id == target) && (msg != message));
            await message.channel.bulkDelete(messages, true)
                .catch(err => { return new Error(err.message) });
        });
}

module.exports = Prune;
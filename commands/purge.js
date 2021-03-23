const { embed } = require('../modules/utils');
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');

class Purge extends Command {
	constructor(client) {
		super(client);
        this.name = 'Purge';
        this.category = 'Utility';
		this.description = 'Clears a number of messages .';
		this.usage = '**purge** *amount*';
	}

	async run(client, message, args) {
		if (args.length !== 1) throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage
        if (!message.member.hasPermission(['MANAGE_MESSAGES'], { checkAdmin: true, checkOwner: true })) throw new Error(`Invalid Permissions - You require permission to manage messages.`); // Check user permissions
        let amount = parseInt(args[0]); // Convert string to int
        if (isNaN(amount)) throw new UserError(`Invalid Usage - Amount must be a number.`)
        if (amount < 1) throw new UserError(`Invalid Usage - Amount must be greater than or equal to one.`);
        for (let i = 0; i < (Math.floor(amount/100)); i++) {
            setTimeout(async () => {await deleteMessages(client, message, 100)}, 250); // Bypass ratelimit and limit of 200 messages per bulkdelete
        }
        await deleteMessages(client, message, (amount%100)); // Delete remaining messages
	}
}

async function deleteMessages(client, message, amount) {
    message.channel.messages.fetch({ limit: amount }) // Fetch messages, then bulk delete
        .then(async (messages) => {
            messages = messages.filter(msg => msg != message);
            message.channel.bulkDelete(messages, true)
                .catch(err => { return new Error(err.message) });
        });
}

module.exports = Purge;
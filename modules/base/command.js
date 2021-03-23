// Base class information for commands

class Command {
	constructor(client) {
		this.client = client;
		this.name = '';
		this.aliases = [];
		this.category = 'Miscellaneous';
		this.description = '';
		this.usage = '';
		this.cooldown = 3000;
		this.disabled = false;
	}

	async run(client, message, args) { }
}

module.exports = Command;

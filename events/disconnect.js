const Event = require('../modules/base/event');
const { discordToken } = require('../resources/settings.json');

class Disconnect extends Event {
	constructor(client) {
		super(client);
		this.name = 'disconnect';
		this.description = 'Disconnect event - Initialised when the client disconnects';
	}

	run(client) {
		client.verbose('Disconnected from the websocket', 0); // If debug is on, log that using severity level 0
        client.login(discordToken);
        client.verbose('Reconnected to the websocket', 0);
	}
}

module.exports = Disconnect;
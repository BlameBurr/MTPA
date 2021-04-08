const Event = require('../modules/base/event');

class Reconnect extends Event {
	constructor(client) {
		super(client);
		this.name = 'reconnect';
		this.description = 'Reconnect event - Initialised when the client reconnects to the API';
	}

	run(client) {
        client.verbose('Reconnected to the websocket', 0);
	}
}

module.exports = Reconnect;
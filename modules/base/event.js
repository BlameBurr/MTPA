// Base class information for Events

class Event {
	constructor(client) {
		this.client = client;
		this.name = '';
		this.description = '';
		this.disabled = false;
	}

	run(...args) { }
}

module.exports = Event;
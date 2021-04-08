// Extended client class
const { Client, Collection } = require('discord.js');
const logHandler = new (require('../logHandler'))();
const webserver = require('../webserver/index');
const DB = require('../databaseHandler');
const quotes = require('./qotd');
const fs = require('fs');

let loadFiles = (directory, callback) => { // Reuses file loading and filtering because loadcmds and events was exactly the same except for 2 lines
	fs.readdir(require('path').resolve(directory), (err, files) => { // Resolves relative path because FS uses absolute paths but it  couldn't have been absolute else we'd have to convert the require into a relative
		if (err) return logHandler.error(err);
		files.forEach((file) => {
			if (!file.toLowerCase().endsWith('.js')) return;
			let [name] = file.split('.');
			let rFile = require(`../../${directory.replace(/\/+$/u, '')}/${name}`) // Regex removes trailing forward slash
			logHandler.verbose(`Loaded ${name}`, 0);
			callback(name, rFile); // Run given function passing the file to it
		});
		return 0;
	});
}

class init extends Client {
	constructor(options) {
		super(options || {});
		this.db = new DB(); // Start and setup database for use
		this.prng = require('../prng'); // Just so that we can use it without having to explicitly import it, this should also mean that collision avoidance is shared across all commands and files
		this.commands = new Collection(); // A collection is essentially discord's extended version of a map
		this.cooldowns = new Collection();
		this.queue = new Map();
		new webserver(this) // Starts web-panel
	}

	log(text) {
		logHandler.log(text);
	}

	warn(text) {
		logHandler.warn(text);
	}

	error(text) {
		logHandler.error(text);
	}

	verbose(text, severity) {
		logHandler.verbose(text, severity);
	}

	writeFile(type, text) {
		logHandler.writeFile(type, text);
	}

	qotd() {
		let seed = Math.floor(new Date().getTime() / 86400000) * 17082003; // Time since epoch, in ms
		let rndInt = Math.floor(this.prng.xorShift(seed).randInt() * quotes.length);
		return quotes[rndInt];
	}

	loadCommands() {
		this.verbose('Loading commands..', 0);
		loadFiles('./commands', (name, commandFile) => {
			this.commands.set(commandFile.name.toLowerCase(), new commandFile(this)); // Adds to command map
		});
	}

	loadEvents() {
		this.verbose('Loading events..', 0);
		loadFiles('./events', (name, eventFile) => {
			if (eventFile.disabled) return;
			this.on(name, (...args) => (new eventFile(this)).run(this, ...args));
		});
	}
}

module.exports = init;
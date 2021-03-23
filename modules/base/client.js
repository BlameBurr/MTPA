// Extended client class
const { Client, Collection } = require('discord.js');
const logHandler = new (require('../logHandler'))();
const webserver = require('../webserver/index');
const DB = require('../databaseHandler');
const quotes = require('./qotd');
const PRNG = require('../prng');
const fs = require('fs');

class init extends Client {
	constructor(options) {
		super(options || {});
		this.db = new DB(); // Start and setup database for use
		this.prng = new PRNG(); // Just so that we can use it without having to explicitly import it, this should also mean that collision avoidance is shared across all commands and files
		this.commands = new Collection(); // A collection is essentially discord's extended version of a map
		this.cooldowns = new Collection();
		this.queue = new Map();
		new webserver(this) // Starts web-panel
	}

	log(text) { logHandler.log(text); }
	warn(text) { logHandler.warn(text); }
	error(text) { logHandler.error(text); }
	verbose(text, severity) { logHandler.verbose(text, severity); }
	writeFile(type, text) { logHandler.writeFile(type, text); }

	qotd() {
		let unixTimestamp = new Date().getTime(); // Time since epoch, in ms
		let day = unixTimestamp / 86400000; // Convert time into days to determine the days since epoch
		let randomNumber = Math.round((quotes.length)*this.prng.lcg(day)); // Used LCG as XORshift needs four values
		return quotes[randomNumber]; // Used for a quote of the day
	}
	
	loadCommands() {
		this.verbose(`Loading commands..`, 0);
		loadFiles('../../commands', (name, commandFile) => {
			this.commands.set(commandFile.name.toLowerCase(), commandFile); // Adds to command map
		});
	}

	loadEvents() {
		this.verbose(`Loading events..`, 0);
		loadFiles('../../events', (name, eventFile) => {
			if (eventFile.disabled) return;
			this.on(name, (...args) => (new eventFile(this)).run(this, ...args));
		});
	}
}

function loadFiles(directory, callback) { // Reuses file loading and filtering because loadcmds and events was exactly the same except for 2 lines
	fs.readdir(require('path').resolve(directory), (err, files) => { // Resolves relative path because FS uses absolute paths but it  couldn't have been absolute else we'd have to convert the require into a relative
		files.forEach(file => {
			if (!file.toLowerCase().endsWith('.js')) return;
			let name = file.split('.')[0];
			let rFile = require(`${directory.replace(/\/+$/, '')}/${name}`) // Regex removes trailing forward slash
			this.verbose(`Loaded ${name}`, 0);
			callback(name, rFile); // Run given function passing the file to it
		});
	});
}

module.exports = init;


/*loadCommands() {
		fs.readdir('./commands/', (err, files) => {
			files.forEach(file => {
				if (!file.toLowerCase().endsWith('.js')) return;
				let name = file.split('.')[0];
				let commandFile = new (require(`../../commands/${name}`))(this);
				this.verbose(`Loaded ${commandFile.name} command`, 0);
				this.commands.set(commandFile.name.toLowerCase(), commandFile); // Adds to command map
			}); // Iterates through directory and runs it through a callback function
		});
	}

	loadEvents() {
		fs.readdir('./events/', (err, files) => {
			files.forEach(file => {
				if (!file.toLowerCase().endsWith('.js')) return;
				let name = file.split('.')[0];
				let eventFile = require(`../../events/${name}`);
				if (!eventFile.disabled) {
					this.verbose(`Loaded ${name} event`, 0);
					this.on(name, (...args) => (new eventFile(this)).run(this, ...args));
				}
			}); // Iterates through directory and runs it through a callback function
		});
	}*/
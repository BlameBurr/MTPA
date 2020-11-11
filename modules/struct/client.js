//Extended client class

const logHandler = new (require("../logHandler"))();
const DB = require("../databaseHandler");
const { Client, Collection } = require("discord.js");
const PRNG = require("../prng"); // My PRNG module
const { quotes } = require("./qotd");
const fs = require("fs");

class init extends Client {
    constructor(options) {
        super(options || {});
        this.db = new DB(); // Start and setup database for use
        this.prng = new PRNG(); // Just so that we can use it without having to explicitly import it, this should also mean that collision avoidance is shared across all commands and files
        this.commands = new Collection(); // A collection is essentially discord's extended version of a map
        this.cooldowns = new Collection();
        this.queue = new Map();
    }

    log(text) { logHandler.log(text) };
    warn(text) { logHandler.warn(text) };
    error(text) { logHandler.error(text) };
    verbose(text, severity) { logHandler.verbose(text, severity) };
    writeFile(type, text) { logHandler.writeFile(type, text) };

    qotd() {
        let unixTimestamp = new Date().getTime();
        let day = Math.floor(unixTimestamp / 86400000);
        let randomNumber = Math.floor(this.prng.lcg(day*17082003, false))*(quotes.length) // Uses days since unix epoch to give daily seeded prng
        return quotes[randomNumber]; // Used for a quote of the day
    }
    
    loadCommands() {
        fs.readdir("./commands/", (err, files) => {
            files.forEach(file => {
                if (!file.toLowerCase().endsWith(".js")) return;
                let name = file.split('.')[0];
                let commandFile = require(`../../commands/${name}`);
                this.verbose(`Loaded ${name} command`, 0);
                this.commands.set(name, commandFile); // Adds to command map
            }); // Iterates through directory and runs it through a callback function
        });
    }

    loadEvents() {
        fs.readdir("./events/", (err, files) => {
            files.forEach(file => {
                if (!file.toLowerCase().endsWith(".js")) return;
                let name = file.split('.')[0];
                let eventFile = require(`../../events/${name}`);
                if (!eventFile.disabled) {
                    this.verbose(`Loaded ${name} event`, 0);
                    this.on(name, (...args) => (new eventFile(this)).run(this, ...args));
                }
            }); // Iterates through directory and runs it through a callback function
        });
    }
}

module.exports = init;

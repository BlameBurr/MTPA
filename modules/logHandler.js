// Dependancies / Variables / Modules
const chalk = require('chalk'); // Chalk for nice colours in console
const fs = require('fs'); // FS for interacting with the filesystem
const verboseValue = require('../resources/settings.json').verbose; // Verbose setting

class logHandler {
	log(text) {
		console.log(`${new Date()}: ${text}`); // Output colourful text to console
		this.writeFile('log', text); // Writes to logs
		return 0; // Returns 0 for validation
	}
    
	warn(text) {
		console.warn(chalk.yellow(`${new Date()} ${text}`)); // Output colourful text to console
		this.writeFile('warn', text); // Writes to logs
		return 0; // Returns 0 for validation
	}
    
	error(text) {
		console.error(chalk.red(`${new Date()} ${text}`)); // Output colourful text to console
		this.writeFile('error', text); // Writes to logs
		return 0; // Returns 0 for validation
	}

	writeFile(type, text) {
		switch (type) {
		case 'warn': text = `[Warn] | [${new Date()}] | ${text}`; break;
		case 'error': text = `[Error] | [${new Date()}] | ${text}`; break;
		default: text = `[Log] | [${new Date()}] | ${text}`; break;
		} // Cycles through types of text/log
    
		fs.appendFileSync(`./resources/logs/${new Date().toISOString().replace(':', '-').slice(0, -14)}_Logs.txt`, `${text}\n`); // Writes to file that is a daily log file name.
	}

	verbose(text, severity) {
		if (!verboseValue && !process.argv.includes('-debug') && !process.argv.includes('-verbose')) return; // Checks verbose status
		if (severity == 1) return this.warn(text);
		if (severity == 2) {return this.error(text);} else {
			if (severity == 0) {
				console.log(chalk.green(`${new Date()} ${text}`));
				this.writeFile('log', text);
			} else {
				this.warn(`Invalid severity range, defaulting to logging. Expected range 0-2, received ${severity} level`);
				return this.error(text); // Defaults to severity level 2 just in case it's important
			}
		}
	}
}

module.exports = logHandler;

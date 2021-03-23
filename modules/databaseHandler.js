const SQLite = require('better-sqlite3');
const { defaultConfig } = require('../resources/settings.json');
const logHandler = new (require('./logHandler'))();

class DB {
	constructor() {
		this.db = new SQLite('./resources/guilds.db'); // I included it in the class so that I can interact with it using custom statements within commands if
		let statement = 'CREATE TABLE IF NOT EXISTS guilds (guildID TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, region TEXT NOT NULL, prefix TEXT NOT NULL, invites INTEGER NOT NULL)';
		this.db.prepare(statement).run();
		statement = 'CREATE TABLE IF NOT EXISTS guildCMDConfig (guildID TEXT PRIMARY KEY NOT NULL, miscellaneous INTEGER NOT NULL, moderator INTEGER NOT NULL, utility INTEGER NOT NULL, music INTEGER NOT NULL, setup INTEGER NOT NULL, moderatorRole TEXT NOT NULL, utilityRole TEXT NOT NULL, musicRole TEXT NOT NULL, setupRole TEXT NOT NULL)';
		this.db.prepare(statement).run();
		this.db.pragma('synchronous = 1');
		this.db.pragma('journal_mode = wal');
		logHandler.verbose('Debug: Initialising database and ensuring that tables exist.', 0);

		this.prefix = {
			get: (guildID) => {
				logHandler.verbose(`Debug: Fetching prefix for ${guildID}`, 0);
				let statement = 'SELECT prefix from guilds WHERE guildID = ?';
				let result = this.db.prepare(statement).get(guildID);
				if (result == undefined) {
					this.prefix.set(guildID);
					return defaultConfig.prefix;
				}
				return result.prefix;   
			},
			set: (guildID, prefix = defaultConfig.prefix) => {
				logHandler.verbose(`Debug: Setting prefix for ${guildID}`, 0);
				let statement = 'UPDATE guilds set prefix = ? WHERE guildID = ?';
				this.db.prepare(statement).run(prefix, guildID);
				return 0;
			},
		}; // Function executes data and manipulates result to return requested things or execute commands.

		this.guild = {
			get: (guildID) => {
				logHandler.verbose(`Debug: Fetching guild information for: ${guildID}`, 0);
				let statement = 'SELECT * FROM guilds WHERE guildID = ?';
				let guildsResult = this.db.prepare(statement).get(guildID);
				statement = 'SELECT * FROM guildCMDConfig WHERE guildID = ?';
				let cmdsResult = this.db.prepare(statement).get(guildID);
				if (cmdsResult == undefined || guildsResult == undefined) return undefined;
				return {guildTable: guildsResult, guildCMDTable: cmdsResult};
			},
			add: (guild) => {
				logHandler.verbose(`Debug: Adding guild (ID: ${guild.id}) to database`, 0);
				let statement = 'INSERT INTO guilds (guildId, name, region, prefix, invites) VALUES (?, ?, ?, ?, ?)';
				let invite = defaultConfig.invites ? 0 : 1;
				this.db.prepare(statement).run(guild.id, guild.name, guild.region, defaultConfig.prefix, invite);
			},
			remove: (guildID) => {
				logHandler.verbose(`Debug: Removing guild (ID: ${guildID}) from database`, 0);
				let statement = 'DELETE FROM guilds WHERE guildID = ?';
				this.db.prepare(statement).run(guildID);
				statement = 'DELETE FROM guildCMDConfig WHERE guildID = ?';
				this.db.prepare(statement).run(guildID);
			},
		};
	}
}

module.exports = DB;

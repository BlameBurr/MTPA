const config = require('./resources/settings.json');
const Client = require('./modules/base/client');
const client = new Client({ autoReconnect: true, disableEveryone: 'everyone' });

try {
	let verbose = false;
	if (config.verbose == true || process.argv.includes('-debug') || process.argv.includes('-verbose')) verbose = true;
	client.log(`Verbose enabled: ${verbose}`);
	client.loadEvents();
	client.loadCommands();
	client.login(config.discordToken);
} catch(err) {
	client.error(err);
}
const Command = require('../modules/base/command');
const { UserError } = require('../modules/base/error');
const { clean, embed, isOwner, request } = require('../modules/utils');
const { sslBypass } = require('../resources/settings.json');
const hastebin = require('hastebin-gen'); // Will replace in future

class Eval extends Command {
	constructor(client) {
		super(client);
		this.name = 'Eval';
		this.category = 'Owner';
		this.aliases = ['dangernoodle'];
		this.description = 'Owner only command that allows remote execution of custom code.';
		this.usage = '**eval** *code/url/file*';
	}

	async run(client, message, args) {
		if (!isOwner(message.author.id)) throw new UserError('Invalid permissions - this is an owner only command, sorry.');
		let code = '';
		let urlFlag = false;
		if (args.length < 1) {
			if (message.attachments.size == 1) code = await request(message.attachments.entries().next().value[1].url); // If a file is attached use it
		} else if (args.length == 1 && args[0].startsWith('http')) {
			if (sslBypass || process.argv.includes('-insecureSSL')) {
				urlFlag = true; // Because we don't want to leave it insecure
				process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // Not advised but I am special so I am excused
			} // Added option to enable or disable, problem only occurs with some sites due to changes to certificate workings, my router has a patch but not every router does
			code = await request(args[0]);
			if (urlFlag == true) process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1; // Restore flag because it's dangerous to leave it on 0
		} else {
			let codeblockRegex = /```(?:js)?\s?([\s\S]+)```/is; // Looks for the start of a codeblock, possibly followed by js
			if (codeblockRegex.test(args.join(' '))) code = args.join(' ').replace(codeblockRegex, '$1');
			else code = args.join(' ');
		}

		if (code == '') throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage

		let embedMsg = embed(message, 'Eval Results');

		let input = `\`\`\`js\n${code}\n\`\`\``;
		if (input.length >= 1024) input = await hastebin(code, { extension: 'js' }); // If it will be too long to embed, upload to hastebin
		embedMsg.addField('Input', input, false);
		
		try {
			let evaled = await eval(code);
			if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled, { depth: 2 }); } // Ensures that it's a string and gets the debug information at depth 2
			evaled = clean(evaled); // Cleans embed and tokens that could be present in output
			let output = `\`\`\`js\n${evaled}\n\`\`\``; // Encloses output in code blocks
			if (output.length >= 1024) output = await hastebin(evaled, { extension: 'js' }); // Uploads to hastebin if too long
			embedMsg.addField('Output', output, false);
		} catch (error) {
			let errorObj = new Error(clean(error.message)); // Forms error object
			let errorMsg = `\`ERROR\` \`\`\`xl\n${errorObj.message}\n\`\`\`` // Encloses error in codeblocks
			if (error.message.length >= 1024) errorMsg = await hastebin(errorObj.message, { extension: 'js' }); // Uploads to hastebin if too long
			embedMsg.addField('Error', errorMsg, false);
		}
		message.channel.send(embedMsg); // Sends embed of results
	}
}

module.exports = Eval;
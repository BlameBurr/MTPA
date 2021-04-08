const Command = require('../modules/base/command');
const { MessageAttachment } = require('discord.js');
const { UserError, EvalError } = require('../modules/base/error');
const { clean, embed, isOwner, request } = require('../modules/utils');
const { sslBypass } = require('../resources/settings.json');

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
		let attachmentContent = '';
		let urlFlag = false;
		if (args.length < 1) {
			if (message.attachments.size == 1) code = await request(message.attachments.entries().next().value[1].url); // If a file is attached use it
		} else if (args.length == 1 && args[0].startsWith('http')) {
			if (sslBypass || process.argv.includes('-insecureSSL')) {
				urlFlag = true; // Because we don't want to leave it insecure
				process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; // Not advised but I am special so I am excused
			} // Added option to enable or disable, problem only occurs with some sites due to changes to certificate workings, my router has a patch but not every router does
			code = await request(args[0]);
			if (urlFlag == true) process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1; // Restore flag because it's dangerous to leave it on 0
		} else {
			let codeblockRegex = /```(?:js)?\s?([\s\S]+)```/isu; // Looks for the start of a codeblock, possibly followed by js
			if (codeblockRegex.test(args.join(' '))) code = args.join(' ').replace(codeblockRegex, '$1');
			else code = args.join(' ');
		}

		if (code == '') throw new UserError(`Invalid Usage - Correct Usage: ${this.usage}`); // Enforces correct usage

		let embedMsg = embed(message, 'Eval Results');

		let input = `\`\`\`js\n${code}\n\`\`\``;
		if (input.length >= 1024) attachmentContent += `//Input:\n${code}\n`; // If it will be too long to embed, upload to hastebin
		else embedMsg.addField('Input', input, false);

		try {
			let evaled = await eval(code);
			if (typeof evaled !== 'string') {
				evaled = require('util').inspect(evaled, { 'depth': 2 });
			} // Ensures that it's a string and gets the debug information at depth 2
			evaled = clean(evaled); // Cleans embed and tokens that could be present in output
			let output = `\`\`\`js\n${evaled}\n\`\`\``; // Encloses output in code blocks
			if (output.length >= 1024) attachmentContent += `/*Result:\n${output}*/\n`;
			else embedMsg.addField('Output', output, false);
		} catch (error) {
			error = (error && error.message) ? error.message : error;
			error = new EvalError(clean(error));

			let formatted = `\`\`\`x1\n${error.message}\n\`\`\``;
			if (formatted.length >= 1024) attachmentContent += `/*Error:\n${error.message}*/`;
			else embedMsg.addField('Error', formatted, false);
		}
		if (attachmentContent == '') return await message.channel.send(embedMsg); // Sends embed of results
		embedMsg.addField('File', 'Parts of the execution resulted in content exceeding 1024 characters and has been attached in a file and sent separately..', false);
		message.channel.send(embedMsg);
		let stream = Buffer.from(attachmentContent);
		let file = new MessageAttachment(stream, 'IPO.js');
		return await message.channel.send(file);
	}
}

module.exports = Eval;
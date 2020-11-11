const Command = require("../modules/struct/command");
const { Util, MessageEmbed } = require("discord.js");
const utilModule = require("../modules/utils");
const https = require("https");
const http = require("http");
const hastebin = require("hastebin-gen"); //Will replace in future

class Eval extends Command {
    constructor(client) {
        super(client);
        this.name = "Eval";
        this.category = "owner"
        this.aliases = ["dangernoodle"];
        this.description = "Owner only command that allows remote execution of custom code."
        this.usage = "**eval** *code/url/file*";
    }

    async run(client, message, args) {
        if (message.author.id != "") throw new Error(`Invalid permissions - this is an owner only command, sorry.`);
        let code = '';
        if (args.length < 1) { if (message.attachments.size == 1) code = await utilModule.request(message.attachments.entries().next().value[1].url) }
        else if (args.length == 1 && args[0].startsWith("http")) code = await utilModule.request(args[0]);
        else {
            let codeblockRegex = /```(?:js)?\s?([\s\S]+)```/is;
            if (codeblockRegex.test(args.join(' '))) code = args.join(' ').replace(codeblockRegex, '$1');
            else code = args.join(' ');
        }

        if (code == '') throw new Error(`Invalid Usage - Correct Usage: ${this.usage}`); //Enforces correct usage

        let embed = new MessageEmbed()
            .setTitle("Eval Results")
        if (`\`\`\`js\n${code}\n\`\`\``.length <= 1024) embed.addField("Input", `\`\`\`js\n${code}\n\`\`\``, false);
        else {
            let id = await hastebin(code, {extension: "js"});
            embed.addField("Input", id, false);
        }
        try {
            let evaled = await eval(code);
            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled, {depth: 2});
            evaled = utilModule.clean(evaled);
            let output = (`\`\`\`js\n${evaled}\n\`\`\``);
            if (output.length <= 1024) embed.addField("Output", output, false);
            else {
                let id = await hastebin(evaled, {extension: "js"});
                embed.addField("Output", id, false);
            }
        } catch (error) {
            error = new Error(utilModule.clean(error.message))
            if (error.message.length <= 1024) embed.addField("Error", `\`ERROR\` \`\`\`xl\n${error.message}\n\`\`\``, false);
            else {
                let id = await hastebin(error.message, {extension: "js"});
                embed.addField("Error", id, false);
            }
        }
        message.channel.send({embed});
    }
}

module.exports = Eval;

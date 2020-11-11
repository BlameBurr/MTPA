// Variables / Dependancies / Modules
const { Collection } = require("discord.js"); // Requires the discord.js library for interacting with the discord API
const Event = require("../modules/struct/event");

class Message extends Event {
    constructor(client) {
        super(client);
        this.name = "message";
        this.description = "Message event - initialised every time a message is sent and the event is triggered by emitter.";
    }

    async run(client, message) {
        if (message.channel.type !== "text") return;
        if (message.author.bot) return;
        
        if (message.content.includes("discord.gg/")) {
            if (!client.db.guild.get(message.guild.id).invites)
                return message.delete();
        }

        let prefix = client.db.prefix.get(message.guild.id);

        if (!message.content.startsWith(prefix)) return;
        
        let command = message.content.split(prefix)[1].split(/ +/g)[0].toLowerCase();
        let args = message.content.split(/ +/g).slice(1);
        
        let fetchedCommand = client.commands.get(command)
            || client.commands.find(commandElement => commandElement.aliases && commandElement.aliases.includes(command));
        if (!fetchedCommand || fetchedCommand.disabled) return;

        let currentTime = Date.now();
        let cooldownTime = (fetchedCommand.cooldown);

        if (!client.cooldowns.get(fetchedCommand.name)) client.cooldowns.set(fetchedCommand.name, new Collection());
        let cooldowns = client.cooldowns;
        if (cooldowns.get(fetchedCommand.name).has(message.author.id)) {
            let expTime = client.cooldowns.get(fetchedCommand.name).get(message.author.id) + cooldownTime;
            if (currentTime < expTime) {
                let timeLeft = (expTime - currentTime) / 1000;
                message.delete();
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command}\` command.`).then(msg => msg.delete({ timeout: 3000 }));
            }
        }

        try {
            await new fetchedCommand(this).run(client, message, args);
            await message.react("✅");
            cooldowns.get(fetchedCommand.name).set(message.author.id, currentTime);
            setTimeout(() => cooldowns.get(fetchedCommand.name).delete(message.author.id), cooldownTime);
        } catch(err) {
            err = err.message == null ? err : err.message
            await message.reply(`Error : ${err}`);
            await message.react("❎"); //Fail icon
            client.error(err);
        }
    }
};

module.exports = Message;

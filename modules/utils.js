const http = require("http");
const https = require("https");
const { discordToken } = require("../resources/settings.json");

class Utils {
    constructor() {}

    request(url) {
        url = url.toString();
        let protocol = (url.toLowerCase().indexOf("https") === 0) ? https : http;
        return new Promise((resolve, reject) => {
            protocol.get(url, (response) => {
                let buffer = '';
                response.on("data", (chunk) => {buffer += chunk});
                response.on("end", () => { resolve(buffer); });
                response.on("error", reject);
            });
        });
    }

    clean(text) {
        if (typeof(text) === "string") {
            text = text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203))
                .replace(discordToken, "[CENSORED TOKEN]");
            return text;
        } else return text; //If none just ignore
    }
}

module.exports = new Utils();

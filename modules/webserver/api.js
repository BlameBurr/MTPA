const express = require('express');
const os = require('os');
const { formatMemoryUnits, formatTimeUnits } = require('../utils');
const pkg = require('../../package.json');
const config = require('../../resources/settings.json');
class API {
    constructor(client) {
        this.express = express;
        this.app = this.express();
        this.router = this.express.Router();

        this.router.get('/', (req, res) => {
            res.sendFile(`${process.cwd()}/modules/webserver/views/images/LN13COL76NJS.jpg`); // Nothing special, I just wanted to put an easter egg in LN13COL76NJS Refers to this exact line of code (line13 column 76 nodejs)
        })
    
        this.router.get('/system', (req, res) => {
            res.json({
                hostname: os.hostname(),
                version: os.version(),
                release: os.release(),
                arch: os.arch(),
                uptime: formatTimeUnits(os.uptime()),
                cpu: {
                    model: os.cpus()[0].model.replace(/^\s+|\s+$/g,''),
                    speed: `${os.cpus()[0].speed/1000} GHz`
                },
                memory: {
                    used: formatMemoryUnits((os.totalmem()-os.freemem()), true),
                    total: formatMemoryUnits(os.totalmem(), true)
                }
            });
        });
    
        this.router.get('/bot', (req, res) => {
            res.json({
                codename: pkg.codename,
                version: pkg.version,
                ready: client.readyAt,
                ping: `${client.ws.ping} ms`,
                uptime: formatTimeUnits(client.uptime, true),
                szGuild: client.guilds.cache.size
            });
        });

        this.router.get('/changelog', (req, res) => {
            let stream = require('fs').createReadStream('./resources/changelog.txt', 'utf8');
            let data = '';
            stream.on('data', (chunk) => data += chunk).on('end', () => res.send(data.replace(/(\r\n|\r|\n)/g, '<br>')));
        })
    }
}
8
module.exports = API;
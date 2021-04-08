const express = require('express');
const os = require('os');
const { formatMemoryUnits, formatTimeUnits } = require('../utils');
const pkg = require('../../package.json');

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
                'arch': os.arch(),
                'cpu': {
                    'model': os.cpus()[0].model.replace(/^\s+|\s+$/gu, ''),
                    'speed': `${os.cpus()[0].speed / 1000} GHz`
                },
                'hostname': os.hostname(),
                'memory': {
                    'total': formatMemoryUnits(os.totalmem(), true),
                    'used': formatMemoryUnits((os.totalmem() - os.freemem()), true)
                },
                'release': os.release(),
                'uptime': formatTimeUnits(os.uptime()),
                'version': os.version()
            });
        });

        this.router.get('/bot', (req, res) => {
            res.json({
                'codename': pkg.codename,
                'ping': `${client.ws.ping} ms`,
                'ready': client.readyAt,
                'szGuild': client.guilds.cache.size,
                'uptime': formatTimeUnits(client.uptime, true),
                'version': pkg.version
            });
        });

        this.router.get('/changelog', (req, res) => {
            let stream = require('fs').createReadStream('./resources/changelog.txt', 'utf8');
            let data = '';
            stream.on('data', (chunk) => {
                data += chunk;
            }).on('end', () => res.send(data.replace(/(\r\n|\r|\n)/gu, '<br>')));
        })
    }
}

module.exports = API;
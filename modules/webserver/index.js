const express = require('express');
const config = require('../../resources/settings.json');
const os = require('os');
const { formatMemoryUnits, formatTimeUnits } = require('../utils');
const api = require('./api');
const cors = require('cors');

class WebServer {
    constructor(client) {
        this.express = express;
        this.app = this.express();
        this.router = this.express.Router();
        this.app.set('port', config.cpanelConfig.port);
        this.app.set('view engine', 'pug');

        this.app.use(cors())

        this.app.set('views', './modules/webserver/views');
        this.app.use('/static/', express.static('./modules/webserver/views/public'));
        this.app.use('/css/', express.static('./modules/webserver/views/css'));
        this.app.use('/images/', express.static('./modules/webserver/views/images'));

        this.router.get("/", (req, res) => {
            res.status(200).render('index.pug');
        });
        this.router.get("/statistics", (req, res) => {
            res.status(200).render('statistics.pug', {destinationIP: config.cpanelConfig.destinationIP});
        });
        this.router.get("/changelog", (req, res) => {
            res.status(200).render('changelog.pug', {destinationIP: config.cpanelConfig.destinationIP});
        });
        this.router.get("/help", (req, res) => {
            res.status(200).render('help.pug');
        });

        this.app.use('/api', new api(client).router)

        this.app.use('/', this.router);
        
	    this.app.listen(80, () => client.verbose(`CPanel listening on port ${config.cpanelConfig.port}`, 0));
    }

}

module.exports = WebServer;

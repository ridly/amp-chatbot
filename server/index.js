import http from 'http';
import https from 'https';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db';
import middleware from './middleware';
import api from './api';
import fs from 'fs';

var app = express();
app.server = http.createServer(app);

// 3rd party middleware
app.use(cors({
	exposedHeaders: ['Link']
}));

app.use(bodyParser.json({
	limit : '100kb'
}));

// connect to db
db( λ => {

	// internal middleware
	app.use(middleware());

	// api router
	app.use('/api', api());

    var options = {
        key: fs.readFileSync('ssl/1_amp-chatbot.com_bundle.key', 'utf8'),
        cert: fs.readFileSync('ssl/1_amp-chatbot.com_bundle.crt', 'utf8'),
        passphrase: 'timikem65'
};
    var httpsServer = https.createServer(options, app).listen(443, function () {
        var host = httpsServer.address().address;
        var port = httpsServer.address().port;
        console.log('App listening at https://%s:%s', host, port);
    });

	// app.server.listen(8080);

	// console.log(`Started on port ${app.server.address().port}`);
});

export default app;

#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var logger = require('logfmt');
var http = require('http');

http.globalAgent.maxSockets = Infinity;

function start() {
    console.log({
        type: 'info',
        msg: 'starting server'
    });

    var instance = app(config);
    instance.on('ready', createServer);
    instance.on('lost', abort);

    function createServer() {
        var server = http.createServer(function(req, res) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('okay');
        });

        process.on('SIGTERM', shutdown);
        instance
            .removeListener('lost', abort)
            .on('lost', shutdown);

        server.listen(443, onListen);




        amqp.connect(process.env.CLOUDAMQP_URL, function(err, conn) {
            conn.createChannel(function(err, ch) {
                var q = 'hello';

                ch.assertQueue(q, { durable: false });
                // Note: on Node 6 Buffer.from(msg) should be used
                ch.sendToQueue(q, new Buffer('Hello World!'));
                console.log(" [x] Sent 'Hello World!'");
            });
        });
    }

    function onListen() {
        console.log({ type: 'info', msg: 'listening', port: server.address().port });
    }

    function shutdown() {
        console.log({ type: 'info', msg: 'shutting down' });
        server.close(function() {
            console.log({ type: 'info', msg: 'exiting' });
            process.exit();
        });
    }


    function abort() {
        console.log({ type: 'info', msg: 'shutting down', abort: true });
        process.exit();
    }

}
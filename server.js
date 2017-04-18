#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var logger = require('logfmt');
var http = require('http');

http.globalAgent.maxSockets = Infinity;

function start() {
    logger.log({
        type: 'info',
        msg: 'starting server'
    });

    var instance = app(config);
    instance.on('ready', createServer);
    instance.on('lost', abort);

    function createServer() {
        var server = http.createServer();

        process.on('SIGTERM', shutdown);
        instance
            .removeListener('lost', abort)
            .on('lost', shutdown);

        server.listen(config.port, onListen);


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
        logger.log({ type: 'info', msg: 'listening', port: server.address().port });
    }

    function shutdown() {
        logger.log({ type: 'info', msg: 'shutting down' });
        server.close(function() {
            logger.log({ type: 'info', msg: 'exiting' });
            process.exit();
        });
    }


    function abort() {
        logger.log({ type: 'info', msg: 'shutting down', abort: true });
        process.exit();
    }

}
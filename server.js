var amqp = require('amqplib/callback_api');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));




app.get('/', function(request, response) {
    response.write('test');
    response.end();

    amqp.connect(process.env.CLOUDAMQP_URL, function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = 'hello';

            ch.assertQueue(q, { durable: false });
            // Note: on Node 6 Buffer.from(msg) should be used
            ch.sendToQueue(q, new Buffer('Hello World!'));
            console.log(" [x] Sent 'Hello World!'");
        });
    });

});



app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
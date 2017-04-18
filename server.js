var express = require('express');
var app = express();

var jackrabbit = require('jackrabbit');
var rabbit = jackrabbit(process.env.RABBITMQ_BIGWIG_TX_URL);
app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
    console.log("test log");
    response.write('test');
    response.end();
    rabbit
        .default()
        .publish('Hello World!' + Math.random(), { key: 'hello' });
    //.on('drain', rabbit.close);
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
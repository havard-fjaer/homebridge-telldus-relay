var amqp = require('amqplib/callback_api');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));




app.get('/', function(request, response) {
    console.log("test log");
    response.write('test');
    response.end();

});



app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
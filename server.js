var express = require('express');
var app = express();
var redis = require('redis');
var publisher = redis.createClient(process.env.REDIS_URL);

app.set('port', (process.env.PORT));

app.get('/:sensorType/:sensor/:action', function(req, res) {
    publisher.publish(req.params['sensorType'] + ":" + req.params['sensor'], req.params['action']);
    res.send(req.params)
});

app.listen(app.get('port'), function() {
    console.log('HTTP port: ', app.get('port'));
});
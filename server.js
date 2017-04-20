var express = require('express');
var app = express();
var redis = require('redis');
var publisher = redis.createClient(process.env.REDIS_URL);
var secret = process.env.APP_SECRET;
app.set('port', (process.env.PORT));

app.get('/:sensorType/:sensor/:action?secret=:secret', function(req, res) {
    if (req.params['secret'] !== secret)
        res.send("Invalid secret!");
    else {
        publisher.publish(req.params['sensorType'] + ":" + req.params['sensor'], req.params['action']);
        res.send(req.params)
    }
});

app.listen(app.get('port'), function() {
    console.log('HTTP port: ', app.get('port'));
});
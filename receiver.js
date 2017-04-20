var redis = require("redis"),
    subscriber = redis.createClient('redis://h:pc2150d5c99e50bc0a6c42ccf2da094fb6af3ef190303dc7269c487da2422e584@ec2-34-206-56-140.compute-1.amazonaws.com:25729');

var channelName = "sensor:";

subscriber.on("pmessage", function(pattern, channel, message) {
    var sensor = channel.replace(channelName, '');
    console.log("Pattern: " + pattern + " - Channel: " + channel + " - Sensor: " + sensor + " - Message: " + message);
    sensorDetected({ sensor, action: message });

});

function sensorDetected(obj) {
    console.log("Sensor: " + obj.sensor + " - Action: " + obj.action);
}

subscriber.psubscribe(channelName + "*");
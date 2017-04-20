var redis = require("redis"),
    subscriber = redis.createClient('redis://h:pc2150d5c99e50bc0a6c42ccf2da094fb6af3ef190303dc7269c487da2422e584@ec2-34-206-56-140.compute-1.amazonaws.com:25729');

var sensorTypes = ["sensor", "button", "switch"];


subscriber.on("pmessage", function(pattern, channel, message) {


    for (var i = 0, len = sensorTypes.length; i < len; i++) {
        var replacePattern = sensorTypes[i] + ":";
        if (channel.startsWith(replacePattern)) {
            var sensor = channel.replace(replacePattern, "");
            console.log("Pattern: " + pattern + " - Channel: " + channel + " - Sensor: " + sensor + " - Message: " + message);
            sensorDetected({ sensor, action: message });
        }
    }



});

function sensorDetected(obj) {
    console.log("Sensor: " + obj.sensor + " - Action: " + obj.action);
}

for (var i = 0, len = sensorTypes.length; i < len; i++) {
    subscriber.psubscribe(sensorTypes[i] + ":*");
}
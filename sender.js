var NRP = require('node-redis-pubsub');
var config = {
    url: 'redis://h:pc2150d5c99e50bc0a6c42ccf2da094fb6af3ef190303dc7269c487da2422e584@ec2-34-206-56-140.compute-1.amazonaws.com:25729'
};

var nrp = new NRP(config); // This is the NRP client 

nrp.on('say hello', function(data) {
    console.log('Hello ' + data.name);
});

nrp.emit('say hello', { name: 'Louis' }); // Outputs 'Hello Louis' 

// You can use patterns to capture all messages of a certain type 
// The matched channel is given as a second parameter to the callback 
nrp.on('city:*', (data, channel) => {
    console.log(data.city + ' is great');
});

nrp.emit('city:hello', { city: 'Paris' }); // Outputs 'Paris is great' 
nrp.emit('city:yeah', { city: 'San Francisco' }); // Outputs 'San Francisco is great' 


nrp.on("error", function(e) {
    console.log(e);
});

// Safely (connections will be closed properly once all commands are sent) 
nrp.quit();

// Dangerously (connections will be immediately terminated) 
nrp.end();
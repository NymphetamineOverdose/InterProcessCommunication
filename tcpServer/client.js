var api = {};
global.api = api;
api.net = require('net');

var socket = new api.net.Socket();

socket.connect({
  port: 2000,
  host: '127.0.0.1',
}, () => {
  socket.on('data', data => {
    var obj = JSON.parse(data);
    console.log('Data received: ' + obj.data);
    var result = {
      id : obj.id,
      data : obj.data.map(item => {
        return item * 2;
      })
    };
    socket.write(JSON.stringify(result));
  });
});
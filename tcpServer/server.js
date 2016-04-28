var api = {};
global.api = api;
api.net = require('net');

var clientsReqCount = 3;
var clients = [];
var responces = [];
var data = [1, 2, 3, 2, 1, 10, 12];

var server = api.net.createServer(socket => {
  console.log('Connected: ' + socket.localAddress);
  if (clients.length >= clientsReqCount) {
    console.log('No more clients');
    socket.end();
    return;
  }

  clients.push(socket);

  if (clients.length === clientsReqCount) {
    var shift = data.length / clientsReqCount;
    clients.forEach((item, i) => {
      var startIndex = i * shift;
      var endIndex = i === data.length - 1 ? data.length - 1 : (i + 1) * shift;
      var task = {
        id : i,
        data : data.slice(startIndex, endIndex)
      };
      item.write(JSON.stringify(task));
    });  
  }

  socket.on('data', data => {
    if (responces.length >= clientsReqCount) {
      console.log('No more responces');
      return;
    }

    responces.push(JSON.parse(data));

    if (responces.length === clientsReqCount) {
      responces.sort((a, b) => a.id - b.id);
      var result = responces.reduce((a, b) => a.concat(b.data), []);
      console.log('Result: ' + result);
      responces.length = 0;
      clients.forEach(item => {item.end();});
      clients.length = 0;
    }
  });

  socket.on('error', err => {});
}).listen(2000);
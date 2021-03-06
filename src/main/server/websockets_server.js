var http = require('http');
const PrettyPrint = require('../prettyprint');


function initWebSocketServer(port, testFinishedCallback) {
  port = port || 8888;

  var server = http.createServer(function(req,res){
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' ) {
      res.writeHead(200);
      res.end();
      return;
    }

    // ...
  });
  var io = require('socket.io').listen(server);

  io.set('origins', '*:*');

  io.sockets.on('connection', function (socket) {
    // console.log('Client connected');
    socket.on('disconnect', () => {

    });
    
    socket.on('log', (data) => {
      console.log(`[LOGGER]`, data);
    });

    socket.on('benchmark_started', (data) => {
      console.log(`**********************************************************************\n* Benchmark started: `);
      PrettyPrint.json(data);
    });

    socket.on('benchmark_finish', function (data) {
      console.log('* Benchmark has finished');
      PrettyPrint.json(data);
      console.log('\n');
      if (data.test_id === 'instancing') {
        socket.emit('next_benchmark', {url: '/static/index2.html'});
      } else {
        //console.log(`**********************************************************************\nFINISHED.`);
        // process.exit(0); 
      }
      io.emit('benchmark_finished', data);
      if (testFinishedCallback) {
        testFinishedCallback(data);
      }
    });

  });

  server.listen(port, function () {
    console.log('* WebSocket results server listening on *:' + port);
  });
}

module.exports = initWebSocketServer;
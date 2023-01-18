const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// accdg documentation, cluster.isMaster is already depracated and replaced with cluster.isPrimary on node v16
if (cluster.isMaster) {
  console.log(`This is the master process: ${process.pid}`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
    console.log('created new cluster');
  }
} else {
  console.log('creating fork server');

  http
    .createServer((req, res) => {
      const message = `worker ${process.pid}...`;
      console.log(message);
      res.end(message);
    })
    .listen(3000);
}

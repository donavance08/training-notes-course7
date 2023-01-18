const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log('this is the master process: ', process.pid);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`worker process ${process.pid} had died`);
    // Object.keys method will extract the keys of cluster.workers object and return an array
    // console.log(`only ${Object.keys(cluster.workers).length} remaining`);

    // once we detected that a worker has died, we just start another worker to take its place
    console.log('starting new worker');
    cluster.fork();
  });
} else {
  console.log(`started a worker at ${process.pid}`);
  http
    .createServer((req, res) => {
      res.end(`process: ${process.pid}`);

      // just making a way to kill the process for testing
      if (req.url === '/kill') {
        process.exit();
      } else if (req.url === '/') {
        console.log(`serving from ${process.pid}`);
      } else {
        console.log(`workingon request ${process.pid}...`);
      }
    })
    .listen(3000);
}

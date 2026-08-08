import cluster from 'node:cluster';
import os from 'node:os';
import process from 'node:process';

// ponytail: Node.js multi-core load balancing for standalone VM/VPS deployment
const numCPUs = os.cpus().length;

if (cluster.isPrimary && process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  console.log(`Primary ${process.pid} is running. Spawning ${numCPUs} workers for load balancing...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Forking replacement...`);
    cluster.fork();
  });
} else {
  // Worker process or dev mode: start Express server
  import('./server');
}

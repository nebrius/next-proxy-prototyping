// Require the framework and instantiate it

// ESM
import { request } from 'node:http';
import Fastify, { FastifyReply } from 'fastify';

const fastify = Fastify({
  logger: true
})

async function proxyRequest(path: string, bootstrap: Record<string, unknown>, reply: FastifyReply) {
  console.log(`Proxying to ${path}`);
  const body = Buffer.from(JSON.stringify({ path, bootstrap }));
  const req = request({
    port: 3001,
    host: '127.0.0.1',
    method: 'POST',
    path: '/page',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  }, (res) => {
    const statusCode = res.statusCode || 500
    reply.code(statusCode);
    if (statusCode >= 400) {
      reply.send('Invalid response');
      return;
    }
    res.on('data', (chunk) => reply.raw.write(chunk));
    res.on('end', () => reply.raw.end());
  })

  req.write(body);
  req.end();
}

// Declare a route
fastify.get('/fry', (request, reply) => {
  proxyRequest('/fry', {
    character: {
      name: 'Fry'
    }
  }, reply)
})

// Declare a route
fastify.get('/bender', (request, reply) => {
  proxyRequest('/bender', {
    character: {
      name: 'Bender'
    },
    factory: {
      name: "Mom's Friendly Robot Factory"
    }
  }, reply)
})

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now listening on ${address}`);
})
// Require the framework and instantiate it

// ESM
import { request } from 'node:http';
import Fastify, { FastifyReply, RouteHandlerMethod } from 'fastify';
import proxy from '@fastify/http-proxy';

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

function createRoute(route: string, getSsrData: () => Record<string, unknown>) {
  fastify.get(route, (request, reply) => {
    proxyRequest(route, getSsrData(), reply);
  });
  // The proxy seems seems to take precedence here, even though it's defined first
  fastify.get(`/_next/data/development/${route}.json`, (request, reply) => {
    proxyRequest(`/_next/data/development/${route}.json`, getSsrData(), reply);
  });
}

createRoute('/characters/fry', () => ({
  character: {
    name: 'Fry'
  }
}));

createRoute('/characters/bender', () =>({
  character: {
    name: 'Bender'
  },
  factory: {
    name: "Mom's Friendly Robot Factory"
  }
}));

// Proxy next internal connections, including websockets for dev HMR
fastify.register(proxy, {
  upstream: 'http://localhost:3001',
  prefix: '/_next',
  rewritePrefix: '/_next',
  http2: false,
  websocket: true
});

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now listening on ${address}`);
})
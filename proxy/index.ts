// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

async function proxyRequest(path: string, bootstrap: Record<string, unknown>) {
  console.log(`Proxying to ${path}`)
}

// Declare a route
fastify.get('/fry', (request, reply) => {
  proxyRequest('/', {
    character: {
      name: 'Fry'
    }
  })
})

// Declare a route
fastify.get('/bender', (request, reply) => {
  proxyRequest('/', {
    character: {
      name: 'Bender'
    },
    factory: {
      name: "Mom's Friendly Robot Factory"
    }
  })
})

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now listening on ${address}`);
})
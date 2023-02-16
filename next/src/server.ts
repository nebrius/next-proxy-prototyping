// server.js
import next from 'next';
import { createServer } from 'node:http';
import { ParsedUrlQuery } from 'node:querystring';
import { parse } from 'node:url';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3001;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {

    // Check if this is a sidecar request, and if not, pass on to Next to handle directly
    if (req.method !== 'POST' || req.url !== '/page') {
      const parsedUrl = parse(req.url || '', true)
      await handle(req, res, parsedUrl)
      return;
    }

    // Buffer the POST data
    let rawData: Buffer[] = []
    req.on('data', (chunk) => {
      rawData.push(chunk)
    });

    // Once the request has finished, we can parse the request
    req.on('end', async () => {
      let pathname: string;
      let query: ParsedUrlQuery;
      try {
        // Convert the post data from a Buffer to a string and JSON parse it
        const payload: { path: string, bootstrap: Record<string, unknown> } = JSON.parse(
          Buffer.concat(rawData).toString('utf-8')
        );
        const path = payload.path;
        req.bootstrap = payload.bootstrap;

        // Make sure the `path` and `bootstrap` properties were passed in, and throw an exception if not to send a 400
        // back to the proxy
        // TODO Should we use JSON schema instead for better typing?
        if (typeof path !== 'string') {
          throw new Error(`Expected "path" in sidecar data to be a string, got ${typeof path}`);
        }
        if (typeof req.bootstrap !== 'object' || Array.isArray(req.bootstrap)) {
          throw new Error(`Expected "path" in sidecar data to be a string, got ${typeof path}`);
        }

        // Parse the path to get the pathname and parsed query parameters
        const parsedPath = parse(path, true)
        if (!parsedPath.pathname) {
          throw new Error(`Could not parse path in sidecar data`);
        }
        pathname = parsedPath.pathname;
        query = parsedPath.query;
      } catch (e) {
        // Log the error
        console.error(`Could not parse sidecar data in request`);
        console.error(e);

        // Send a 400 back to the proxy
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.write('Invalid request');
        return;
      }

      // If we got here, we can finally render the page
      await app.render(req, res, pathname, query)
    })
  }).listen(port, () => {
    console.log(`Server is now listening on http://${hostname}:${port}`)
  })
})

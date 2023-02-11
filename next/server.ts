// server.js
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3001;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    if (req.method !== 'POST' || req.url !== '/page') {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.write('Invalid request');
    }
    console.log('Reading request');
    let rawData: Buffer[] = []
    req.on('data', (chunk) => {
      rawData.push(chunk)
    });
    req.on('end', async () => {
      try {
        const { path, bootstrap } = JSON.parse(
          Buffer.concat(rawData).toString('utf-8')
        ) as { path: string, bootstrap: Record<string, unknown> };
        (req as any).bootstrap = bootstrap
        const { pathname, query } = parse(path, true)
        await app.render(req, res, pathname!, query)
      } catch (e) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.write('Invalid request');
        console.error(e);
      }
    })
  }).listen(port, () => {
    console.log(`Server is now listening on http://${hostname}:${port}`)
  })
})

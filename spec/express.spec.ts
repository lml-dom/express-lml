// tslint:disable:no-magic-numbers object-literal-sort-keys

import * as express from 'express';
import { readFileSync } from 'fs';
import { request } from 'http';
import { parseLML } from 'lml';

import { loadViewEngine } from '../index';

describe('Express LML view engine plugin', () => {
  const html = parseLML(readFileSync(`${__dirname}/test-views/index.lml`, 'utf8')).toHTML();
  const port = 20000 + Math.floor(Date.now() / 1000) % 3600;
  let app: express.Application;

  beforeAll((done) => {
    app = express();
    loadViewEngine(app);
    app.set('views', `${__dirname}/test-views`);
    app.get('/', (_req, res) => {
      res.render('index');
    });
    app.listen(port, () => {
      done();
    });
  });

  it('responds in HTML', (done) => {
    const req = request(`http://localhost:${port}/`, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        expect(res.headers['content-type'].indexOf('text/html')).toBeGreaterThan(-1);
        expect(body).toBe(html);
        done();
      });
    });
    req.end();
  });
});

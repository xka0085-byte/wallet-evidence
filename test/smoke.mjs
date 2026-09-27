import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
import path from 'node:path';

const cli = path.resolve('bin/wallet-evidence.mjs');
const signature = '5'.repeat(88);
const server = createServer(async (req, res) => {
  let body = ''; for await (const chunk of req) body += chunk;
  const request = JSON.parse(body);
  res.setHeader('content-type', 'application/json');
  if (req.url === '/ok') { res.end(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { slot: 7, blockTime: 8, meta: { err: null, fee: 5000 }, transaction: { message: { instructions: [{ program: 'system', parsed: { type: 'transfer', info: { lamports: 1 } } }] } } } })); return; }
  if (req.url === '/failed') { res.end(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { slot: 7, meta: { err: { InstructionError: [0, 'failed'] }, fee: 1 }, transaction: { message: { instructions: [] } } } })); return; }
  if (req.url === '/missing') { res.end(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: null })); return; }
  if (req.url === '/malformed') { res.end(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { slot: 1 } })); return; }
  if (req.url === '/http-error') { res.writeHead(500); res.end('{}'); return; }
  res.end(JSON.stringify({ jsonrpc: '2.0', id: request.id, error: { code: -32000, message: 'fixture error' } }));
});
server.listen(0, '127.0.0.1'); await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;
function run(rpc) { return new Promise(resolve => { const p = spawn(process.execPath, [cli, 'inspect', signature, `--rpc=${rpc}`, '--json']); let out = ''; let err = ''; p.stdout.on('data', x => out += x); p.stderr.on('data', x => err += x); p.on('close', code => resolve({ code, report: out ? JSON.parse(out) : null, error: err })); }); }
try {
  const ok = await run(`${base}/ok`); assert.equal(ok.code, 0); assert.equal(ok.report.status, 'PASS'); assert.equal(ok.report.parsedInstructionCount, 1);
  const failed = await run(`${base}/failed`); assert.equal(failed.code, 1); assert.equal(failed.report.status, 'FAIL');
  const missing = await run(`${base}/missing`); assert.equal(missing.code, 2); assert.equal(missing.report.status, 'UNKNOWN');
  const rpcError = await run(`${base}/error`); assert.equal(rpcError.code, 2); assert.equal(rpcError.report.status, 'UNKNOWN');
  const rejected = await run('http://example.com/rpc'); assert.equal(rejected.code, 3);
  const malformed = await run(`${base}/malformed`); assert.equal(malformed.code, 2); assert.equal(malformed.report.status, 'UNKNOWN');
  const httpError = await run(`${base}/http-error`); assert.equal(httpError.code, 2); assert.equal(httpError.report.status, 'UNKNOWN');
  console.log('wallet-evidence smoke tests passed');
} finally { server.close(); }

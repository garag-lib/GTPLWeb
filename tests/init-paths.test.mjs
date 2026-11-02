import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const tool = fileURLToPath(new URL('../tools/init-app.js', import.meta.url));

test('starter rejects a non-directory ancestor before writing any files', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gtplweb-init-paths-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const sentinel = 'existing ordinary file';
  fs.writeFileSync(path.join(dir, 'src'), sentinel);
  const result = spawnSync(process.execPath, [tool, dir, '--yes'], {
    cwd: dir, encoding: 'utf8', timeout: 10_000,
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /src is not a directory/);
  assert.deepEqual(fs.readdirSync(dir), ['src']);
  assert.equal(fs.readFileSync(path.join(dir, 'src'), 'utf8'), sentinel);
});

test('starter checks ancestors above an absent target directory', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gtplweb-init-parent-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'blocked'), 'keep');
  const target = path.join(dir, 'blocked/app');
  const result = spawnSync(process.execPath, [tool, target, '--yes'], {
    cwd: dir, encoding: 'utf8', timeout: 10_000,
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /blocked is not a directory/);
  assert.deepEqual(fs.readdirSync(dir), ['blocked']);
  assert.equal(fs.readFileSync(path.join(dir, 'blocked'), 'utf8'), 'keep');
});

test('starter rejects dangling directory symlinks before writing files', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gtplweb-init-symlink-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.symlinkSync(path.join(dir, 'missing'), path.join(dir, 'src'), 'dir');
  const result = spawnSync(process.execPath, [tool, dir, '--yes'], {
    cwd: dir, encoding: 'utf8', timeout: 10_000,
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /src is not a directory/);
  assert.deepEqual(fs.readdirSync(dir), ['src']);
  assert.equal(fs.existsSync(path.join(dir, 'missing')), false);
});

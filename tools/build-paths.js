import fs from 'node:fs';
import path from 'node:path';

// Resolve existing ancestors too: an output directory need not exist yet.
export function canonicalPath(value) {
  const absolute = path.resolve(value);
  try {
    return fs.realpathSync(absolute);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const parent = path.dirname(absolute);
    if (parent === absolute) throw error;
    return path.join(canonicalPath(parent), path.basename(absolute));
  }
}

export function containsPath(parent, child) {
  const relative = path.relative(canonicalPath(parent), canonicalPath(child));
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

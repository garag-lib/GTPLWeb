import GTPL from '@mpeliz/gtpl';
import { setTemplateCompiler } from './decorators/template-compiler.js';

setTemplateCompiler(html => GTPL.jit.GCompile(GTPL.jit.GCode(html)));

export * from './runtime.js';

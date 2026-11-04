type TemplateCompiler = (html: string) => any;
let compiler: TemplateCompiler | undefined;

export function setTemplateCompiler(value: TemplateCompiler) {
    compiler = value;
}

export function requireTemplateCompiler(): TemplateCompiler {
    if (!compiler) {
        throw new Error('GTPLWeb runtime requires an AOT template. Run gtpl-aot or use @mpeliz/gtplweb for JIT templates.');
    }
    return compiler;
}

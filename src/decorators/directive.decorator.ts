import GTPL from '@mpeliz/gtpl';

/**
 * Configuración del decorador @Directive()
 */
export interface DirectiveConfig {
    /**
     * Nombre de la directiva (debe ser un nombre de atributo HTML válido).
     * Si no se define, se genera automáticamente a partir del nombre de la clase.
     */
    name?: string;
}

/**
 * Verifica que el nombre sea un atributo HTML válido.
 */
function isValidAttributeName(name: string): boolean {
    // Simplificado, pero cubre los casos válidos en HTML y SVG
    return /^[a-zA-Z_][a-zA-Z0-9_\-:.]*$/.test(name);
}

/**
 * 🧭 Decorador para registrar una directiva en GTpl
 */
export function Directive(config?: DirectiveConfig) {
    return function (constructor: any) {
        
        // Derivar nombre automáticamente si no se pasa
        const name =
            config?.name ??
            constructor.name
                .replace(/Directive$/, '') // quita sufijo si lo hay
                .replace(/([A-Z])/g, '-$1') // pasa CamelCase → kebab-case
                .toLowerCase()
                .slice(1); // quita primer guion

        if (!name) {
            throw new Error('@Directive() requiere un nombre válido');
        }

        // Validar nombre de atributo HTML
        if (!isValidAttributeName(name)) {
            throw new Error(
                `Nombre de directiva inválido: "${name}". Debe ser un nombre de atributo HTML válido.`
            );
        }

        // Registrar en el core de GTpl
        const success = GTPL.GregisterDirective(name, constructor);

        if (!success) {
            console.warn(`⚠️ La directiva "${name}" ya está registrada.`);
        }

        return constructor;
    };
}

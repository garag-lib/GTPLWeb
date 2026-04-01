export interface DirectiveConfig {
    name?: string;
}
export declare function Directive(config?: DirectiveConfig): (constructor: any) => any;

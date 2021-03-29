export default class Properties {
    private _propertiesMap;
    private _style;
    constructor(stylePrototype: any);
    style(cssPropertyKey?: string, cssPropertyValue?: string): any;
    list(options?: any): any[];
    listEditable(): any[];
    toJSON(): any;
    toString(): string;
    set(key: string, value: any): this;
    has(property: string): string;
    clearAll(): void;
}

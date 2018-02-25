export default class SimpleStyle {
    private _styles;
    constructor(stylePrototype?: SimpleStyle | any);
    style(cssPropertyKey?: string, cssPropertyValue?: string): any;
    static copyStyle(entity: any, computedStyle: any, cssPropertyKey: string, backupCssPropertyKey?: string, debug?: boolean): void;
    static copyStyles(entity: any, markup: any, debug?: boolean): void;
}

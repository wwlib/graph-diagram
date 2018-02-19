import SimpleStyle from './SimpleStyle';

export default class Properties {

    // public keys: string[] = [];
    // public values: any = {};

    private _propertiesMap: Map<string, any>;
    private _style: SimpleStyle;

    constructor(stylePrototype: any) {
        this._propertiesMap = new Map<string, any>();
        this._style = new SimpleStyle(stylePrototype);
    }

    style(cssPropertyKey?: string, cssPropertyValue?: string): any {
        return this._style.style(cssPropertyKey, cssPropertyValue);
    }

    list(): any[] {
        // return this.keys.map((key: string) => {
        //     return { key: key, value: this.values[key] };
        // });
        let result: any[] = [];
        this._propertiesMap.forEach((value: any, key: string) => {
            result.push( { key: key, value: value } );
        });
        return result;
    };

    toString() {
        return JSON.stringify(this.list());
    }

    set(key: string, value: any) {
        // if (!this.values[key]) {
        //     this.keys.push(key);
        // }
        // this.values[key] = value;
        this._propertiesMap.set(key, value);
        return this;
    };

    has(property: string): string {
      return this._propertiesMap.get(property);
    }
    
    clearAll() {
        // this.keys = [];
        // this.values = {};
        this._propertiesMap = new Map<string, any>();
    };
};

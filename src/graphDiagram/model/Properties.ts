import GraphDiagram from '../GraphDiagram';
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

    list(options?: any): any[] {
        let exclude: string[];
        if (options) {
            exclude = options.exclude;
        }
        let result: any[] = [];
        this._propertiesMap.forEach((value: any, key: string) => {
            if (!exclude || exclude.indexOf(key) == -1) {
                result.push( { key: key, value: value } );
            }
        });
        return result;
    };

    listEditable(): any[] {
      return this.list({exclude: [GraphDiagram.MODEL_ID_KEY]});
    }

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

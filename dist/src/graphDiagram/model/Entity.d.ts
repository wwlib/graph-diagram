import Model from './Model';
import Properties from './Properties';
import SimpleStyle from './SimpleStyle';
export default class Entity {
    model: Model;
    id: string;
    index: number;
    classes: string[];
    protected _properties: Properties;
    protected _caption: string;
    protected _entityType: string;
    _style: SimpleStyle;
    constructor(model: Model);
    style(cssPropertyKey?: string, cssPropertyValue?: string): any;
    class(classesString?: string): any;
    caption: string;
    readonly displayCaption: string;
    readonly properties: Properties;
}

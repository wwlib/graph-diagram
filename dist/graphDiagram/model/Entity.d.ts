import Model from './Model';
import Properties from './Properties';
import SimpleStyle from './SimpleStyle';
export default class Entity {
    model: Model;
    id: string;
    classes: string[];
    protected _properties: Properties;
    protected _label: string;
    protected _entityType: string;
    _style: SimpleStyle;
    constructor(model: Model);
    style(cssPropertyKey?: string, cssPropertyValue?: string): any;
    class(classesString?: string): any;
    caption: string;
    label: string;
    readonly displayCaption: string;
    readonly displayLabel: string;
    readonly properties: Properties;
}

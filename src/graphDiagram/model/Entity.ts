import Model from './Model';
import Properties from './Properties';
import SimpleStyle from './SimpleStyle';

export default class Entity {
    public model: Model;
    public id: string;
    public classes: string[] = [];
    protected _properties:Properties;
    protected _caption: string;
    protected _type: string;
    public _style: SimpleStyle;

    constructor(model: Model) {
        this.model = model;
        this._caption = "";
        this._type = "";
    }

    style(cssPropertyKey?: string, cssPropertyValue?: string): any {
        return this._style.style(cssPropertyKey, cssPropertyValue);
    }

    class(classesString?: string): any { // returns a string array or a reference to the instance - ugh, JS
        if (arguments.length == 1) {
            this.classes = classesString.split(" ").filter((className: string) => {
                return className.length > 0 && className != this._type;
            });
            return this;
        }
        return [this._type].concat(this.classes);
    };

    set caption(captionText: string) {
        this._caption = captionText;
    }

    get caption(): string {
        return this._caption;
    }

    get properties(): Properties {
        return this._properties;
    }
}

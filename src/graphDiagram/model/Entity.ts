import GraphDiagram from '../GraphDiagram';
import Model from './Model';
import Properties from './Properties';
import SimpleStyle from './SimpleStyle';

export default class Entity {
    public model: Model;
    public id: string;
    public index: number;
    public classes: string[] = [];
    protected _properties:Properties;
    protected _label: string;
    protected _entityType: string;
    public _style: SimpleStyle;

    constructor(model: Model) {
        this.model = model;
        this._label = "";
        this._entityType = "";
    }

    style(cssPropertyKey?: string, cssPropertyValue?: string): any {
        return this._style.style(cssPropertyKey, cssPropertyValue);
    }

    class(classesString?: string): any {
        if (arguments.length == 1) {
            this.classes = classesString.split(" ").filter((className: string) => {
                return className.length > 0 && className != this._entityType;
            });
            return this;
        }
        return [this._entityType].concat(this.classes);
    };

    set caption(captionText: string) {
        this._label = captionText;
    }

    get caption(): string {
        return this._label;
    }

    set label(labelText: string) {
        this._label = labelText;
    }

    get label(): string {
        return this._label;
    }

    get displayCaption(): string {
        return this.displayLabel;
    }

    get displayLabel(): string {
        let name = this.properties.has('name');
        if (name) {
            return `${this._label}: ${name}`;
        } else {
            return this._label;
        }
    }

    get properties(): Properties {
        if (this.model.id) {
            this._properties.set(GraphDiagram.MODEL_ID_KEY, this.model.id);
        }
        return this._properties;
    }
}

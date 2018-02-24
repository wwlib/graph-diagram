import Model from './Model';
import Entity from './Entity';
import Node from './Node';
import Properties from './Properties';
import SimpleStyle from './SimpleStyle';

export default class Relationship extends Entity {
    public _relationshipType: string;
    public start: Node;
    public end: Node;

    constructor(model: Model, start: Node, end: Node) {
        super(model);
        this._entityType = "relationship";
        this.start = start;
        this.end = end;
        this._properties = new Properties(model.stylePrototype.relationshipProperties);
        this._style = new SimpleStyle(model.stylePrototype.relationship);
    }

    set relationshipType(relationshipTypeText: string) {
            this._relationshipType = relationshipTypeText;
    }

    get relationshipType(): string {
        return this._relationshipType;
    }

    reverse() {
        var oldStart = this.start;
        this.start = this.end;
        this.end = oldStart;
    }
}

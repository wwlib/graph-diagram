import Model from './Model';
import Entity from './Entity';
import Node from './Node';
export default class Relationship extends Entity {
    _relationshipType: string;
    start: Node;
    end: Node;
    constructor(model: Model, start: Node, end: Node);
    relationshipType: string;
    reverse(): void;
}

import Node from './Node';
import Relationship from './Relationship';
export default class Model {
    nodes: Map<string, Node>;
    relationships: Map<string, Relationship>;
    highestNodeIndex: number;
    highestRelationshipIndex: number;
    stylePrototype: any;
    parameters: any;
    private _id;
    private _internalScale;
    private _externalScale;
    constructor(id?: string);
    toString(): string;
    summary(): any;
    generateNodeIndex(): number;
    createNode(optionalId?: string): Node;
    deleteNode(node: Node): void;
    deleteRelationship(relationship: Relationship): void;
    generateRelationshipIndex(): number;
    createRelationship(start: Node, end: Node, optionalId?: string): Relationship;
    nodeList(): Node[];
    lookupNode(nodeId: number): Node;
    relationshipList(): Relationship[];
    groupedRelationshipList(): any;
    id: string;
    internalScale: number;
    externalScale: number;
}

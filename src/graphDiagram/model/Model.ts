import SimpleStyle from './SimpleStyle';
import * as d3 from 'd3';
import Node from './Node';
import Relationship from './Relationship';

export default class Model {

    public nodes: any[] = []; //Map
    public relationships: any[] = [];
    public highestId: number = 0;

    public stylePrototype: any;

    public parameters: any = {
        radius: 50,
        nodeStrokeWidth: 8,
        nodeStartMargin: 11,
        nodeEndMargin: 11,
        speechBubbleMargin: 20,
        speechBubblePadding: 10,
        speechBubbleStrokeWidth: 3,
        snapTolerance: 20
    };

    private _internalScale: number = 1;
    private _externalScale: number = 1;
/*
    .graph-diagram-markup {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }

    .graph-diagram-markup .node {
        font-size: 14px;
        margin: 5px;
        padding: 5px;
        min-width: 30px;
        background-color: #f7f7f9;
        border: 1px solid rgba(0, 0, 0, 0.3);
    }

    .graph-diagram-markup .relationship {
        font-size: 14px;
        width: 2px;
        margin: 10px;
        background-color: rgba(0, 0, 0, 0.3);
        border: none;
    }

    .graph-diagram-markup .properties {
        font-size: 14px;
        margin: 12px;
        padding: 4px;
        background-color: white;
        border: 1px solid rgba(0, 0, 0, 0.5);
    }
*/
    constructor() {
        this.stylePrototype = {
            node: new SimpleStyle({
                'min-width': '30px',
                'font-size': '14px',
                'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
                'padding': '5px',
                'border-width': '1px',
                'border-color': 'rgba(0, 0, 0, 0.3)',
                'margin': '5px',
                'background-color': '#f7f7f9',
                'border': '1px solid rgba(0, 0, 0, 0.3)'
            }),
            nodeProperties: new SimpleStyle({
                'font-size': '14px',
                'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
                'padding': '4px',
                'margin': '12px',
                'background-color': 'white',
                'border': '1px solid rgba(0, 0, 0, 0.5)',
                'border-color': 'rgba(0, 0, 0, 0.5)',
                'border-width': '1px'
            }),
            relationship: new SimpleStyle({
                'font-size': '14px',
                'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
                'width': '2px',
                'border-width': '3px',
                'margin': '10px',
                'background-color': 'rgba(0, 0, 0, 0.3)',
                'border': 'none'
            }),
            relationshipProperties: new SimpleStyle({
                'font-size': '14px',
                'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
                'padding': '4px',
                'margin': '12px',
                'background-color': 'white',
                'border': '1px solid rgba(0, 0, 0, 0.5)',
                'border-color': 'rgba(0, 0, 0, 0.5)',
                'border-width': '1px'
            })
        };
    }

    toString(): string {
        let result: string = 'Model:\n';
        let obj: any = {
            highestId: this.highestId,
            nodeCount: this.nodes.length,
            relationshipCount: this.relationships.length,
            nodeStylePrototype: this.stylePrototype.node.style(),
        }
        result += JSON.stringify(obj);
        return result
    }

    summary(): any {
        let obj: any = {
            highestId: this.highestId,
            nodeCount: this.nodes.length,
            relationshipCount: this.relationships.length,
            nodePropertiesStylePrototype: this.stylePrototype.nodeProperties.style(),
            relationshipPropertiesStylePrototype: this.stylePrototype.relationshipProperties.style(),
        }
        return obj
    }

    generateNodeId(): string {
        while (this.nodes[this.highestId]) {
            this.highestId++;
        }
        return `${this.highestId}`;
    }

    createNode(optionalNodeId?: string): Node {
        var nodeId: string = optionalNodeId || this.generateNodeId();
        var node: Node = new Node(this);
        node.id = nodeId;
        this.nodes[nodeId] = node;
        return node;
    };

    deleteNode(node: Node) {
        this.relationships = this.relationships.filter(function (relationship) {
            return !(relationship.start === node || relationship.end == node);
        });
        delete this.nodes[node.id];
    };

    deleteRelationship(relationship: any) {
        this.relationships.splice(this.relationships.indexOf(relationship), 1);
    };

    createRelationship(start: Node, end: Node) {
        var relationship = new Relationship(this, start, end);
        this.relationships.push(relationship);
        return relationship;
    };

    nodeList(): Node[] {
        var list: Node[] = [];
        for (var nodeId in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeId)) {
                list.push(this.nodes[nodeId]);
            }
        }
        return list;
    };

    lookupNode(nodeId: number): Node {
        return this.nodes[nodeId];
    };

    relationshipList(): Relationship[] {
        return this.relationships;
    };

    groupedRelationshipList(): number[][] {
        var groups: number[][] = [];
        for (var i = 0; i < this.relationships.length; i++)
        {
            var relationship: Relationship = this.relationships[i];
            var nodeIds: string[] = [relationship.start.id, relationship.end.id].sort();
            var group = groups[nodeIds[0], nodeIds[1]];
            if (!group)
            {
                group = groups[nodeIds[0], nodeIds[1]] = [];
            }
            if (relationship.start.id < relationship.end.id)
            {
                group.push(relationship);
            }
            else
            {
                group.splice(0, 0, relationship);
            }
        }
        return d3.values(groups);
    };

    set internalScale(newScale: number) {
        this._internalScale = newScale; //NOTE parseFloat(newScale);
    };

    get internalScale(): number {
        return this._internalScale;
    }

    set externalScale(newScale: number) {
        this._externalScale = newScale; //NOTE parseFloat(newScale);
    };

    get externalScale(): number {
        return this._externalScale;
    }
};

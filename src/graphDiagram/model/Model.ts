import SimpleStyle from './SimpleStyle';
import * as d3 from 'd3';
import Node from './Node';
import Relationship from './Relationship';

export default class Model {

    public nodes: Map<string, Node> = new Map<string, Node>();
    public relationships: Map<string, Relationship> = new Map<string, Relationship>();
    public highestNodeIndex: number = 0;
    public highestRelationshipIndex: number = 0;

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

    private _id: string;
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
    constructor(id?: string) {
        if (id) {
          this._id = id;
        }
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
            highestNodeIndex: this.highestNodeIndex,
            highestRelationshipIndex: this.highestRelationshipIndex,
            nodeCount: this.nodes.size,
            relationshipCount: this.relationships.size,
            nodeStylePrototype: this.stylePrototype.node.style(),
        }
        result += JSON.stringify(obj);
        return result
    }

    summary(): any {
        let obj: any = {
            highestNodeIndex: this.highestNodeIndex,
            highestRelationshipIndex: this.highestRelationshipIndex,
            nodeCount: this.nodes.size,
            relationshipCount: this.relationships.size,
            nodePropertiesStylePrototype: this.stylePrototype.nodeProperties.style(),
            relationshipPropertiesStylePrototype: this.stylePrototype.relationshipProperties.style(),
        }
        return obj
    }

    generateNodeIndex(): number {
        // while (this.nodes.get(`${this.highestNodeIndex}`)) {
        //     this.highestNodeIndex++;
        // }
        return this.highestNodeIndex++;
    }

    createNode(optionalId?: string): Node {
        var node: Node = new Node(this);
        node.index = this.generateNodeIndex();
        var nodeId: string = optionalId || `${node.index}`;
        node.id = nodeId;
        this.nodes.set(nodeId, node);
        return node;
    };

    deleteNode(node: Node) {
        // this.relationships = this.relationships.filter(function (relationship) {
        //     return !(relationship.start === node || relationship.end == node);
        // });
        this.relationships.forEach((relationship: Relationship, id: string, map) => {
            if ((relationship.start === node) || (relationship.end === node)) {
                this.relationships.delete(id)
            }
        });
        this.nodes.delete(node.id);
    };

    deleteRelationship(relationship: Relationship) {
        //this.relationships.splice(this.relationships.indexOf(relationship), 1);
        this.relationships.delete(relationship.id);
    };

    generateRelationshipIndex(): number {
        // while (this.relationships.get(`${this.highestRelationshipIndex}`)) {
        //     this.highestRelationshipIndex++;
        // }
        return this.highestRelationshipIndex++;
    }

    createRelationship(start: Node, end: Node, optionalId?: string) {
        var relationship = new Relationship(this, start, end);
        relationship.index = this.generateRelationshipIndex();
        var relationshipId: string = optionalId || `${relationship.index }`;
        relationship.id = relationshipId;
        this.relationships.set(relationshipId, relationship);
        return relationship;
    };

    nodeList(): Node[] {
        return Array.from( this.nodes.values() );
    };

    lookupNode(nodeId: number): Node {
        return this.nodes.get(`${nodeId}`);
    };

    relationshipList(): Relationship[] {
        return Array.from( this.relationships.values() );
    };

    groupedRelationshipList(): any {
        var groups: any = {};
        this.relationships.forEach((relationship: Relationship, id: string, map) => {
            var nodeIds: any = [relationship.start.id, relationship.end.id].sort();
            var group = groups[nodeIds];
            if (!group)
            {
                group = groups[nodeIds] = [];
            }
            if (relationship.start.id < relationship.end.id)
            {
                group.push(relationship);
            }
            else
            {
                group.splice(0, 0, relationship);
            }
        });
        return d3.values(groups);
    };

    set id(id: string) {
      this._id = id;
    }

    get id(): string {
      return this._id;
    }

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

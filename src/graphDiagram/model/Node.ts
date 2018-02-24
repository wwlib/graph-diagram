import Model from './Model';
import Entity from './Entity';
import Properties from './Properties';
import SimpleStyle from './SimpleStyle';

export default class Node extends Entity {
    public position: any = {};
    public prototypePosition: any;
    public radius: number = 25; //TODO get the actual radius, i.e. from LayoutNode

    constructor(model: Model) {
        super(model);
        this._entityType = "node";
        this._properties = new Properties(model.stylePrototype.nodeProperties);
        this._style = new SimpleStyle(model.stylePrototype.node);
        this._caption = "";
    }

    set x(x: number) {
        this.position.x = Number(x);
    };

    get x(): number {
        return this.position.x;
    }

    set y(y: number) {
        this.position.y = Number(y);
    }

    get y(): number {
        return this.position.y
    }

    // funky usage precludes get/set for now
    ex(): number {
        return this.position.x * this.model.internalScale;
    }

    // funky usage precludes get/set for now
    ey(): number {
        return this.position.y * this.model.internalScale;
    }

    distanceTo(node: Node): number {
        var dx = node.x - this.x;
        var dy = node.y - this.y;
        return Math.sqrt(dx * dx + dy * dy) * this.model.internalScale;
    }

    snap( position: any, field: any, node: Node ) //TODO find a better way to reference accessors of Node
    {
        var ideal = position[field];
        var closestNode: Node;
        var closestDistance = Number.MAX_VALUE;
        for (var nodeId in this.model.nodes) {
            if (this.model.nodes.hasOwnProperty(nodeId)) {
                var candidateNode = this.model.nodes[nodeId];
                if ( candidateNode != node )
                {
                    // console.log(`Node: snap: field: ${field}`)
                    var distance: number = 0;
                    if (field == "x") {
                        distance = Math.abs(candidateNode.x - ideal);
                    } else if (field == "y") {
                        distance = Math.abs(candidateNode.y - ideal);
                    }
                    // var distance = Math.abs(candidateNode[field]() - ideal); //TODO find a better way to reference accessors of Node
                    if (distance < closestDistance)
                    {
                        closestNode = candidateNode;
                        closestDistance = distance;
                    }
                }
            }
        }
        if (closestDistance < this.model.parameters.snapTolerance)
        {
            if (field == "x") {
                return closestNode.x;
            } else if (field == "y") {
                return closestNode.y;
            }
        }
        else
        {
            if (field == "x") {
                return position.x;
            } else if (field == "y") {
                return position.y;
            }
        }
    }

    drag(dx: number, dy: number) {
        if (!this.prototypePosition)
        {
            this.prototypePosition = {
                x: this.position.x,
                y: this.position.y
            }
        }
        this.prototypePosition.x += dx / this.model.internalScale;
        this.prototypePosition.y += dy / this.model.internalScale;
        this.position.x = this.snap(this.prototypePosition, "x", this); //TODO
        this.position.y = this.snap(this.prototypePosition, "y", this); //TODO

        // console.log(this.position, this.prototypePosition, this.model.internalScale);
    }

    dragEnd()
    {
        this.prototypePosition = undefined;
        // console.log(this.position, this.prototypePosition);
    }

    // distance() {
    //     var dx = this.node.x - this.x;
    //     var dy = this.node.y - this.y;
    //     return Math.sqrt(dx * dx + dy * dy) * this.model.internalScale;
    // };

    angleTo(node: Node) {
        var dx = node.x - this.x;
        var dy = node.y - this.y;
        return Math.atan2(dy, dx) * 180 / Math.PI
    };

    isLeftOf(node: Node) {
        return this.x < node.x;
    };
}

import Model from './Model';
import Entity from './Entity';
export default class Node extends Entity {
    position: any;
    prototypePosition: any;
    radius: number;
    constructor(model: Model);
    x: number;
    y: number;
    ex(): number;
    ey(): number;
    distanceTo(node: Node): number;
    snap(position: any, field: any, node: Node): any;
    drag(dx: number, dy: number): void;
    dragEnd(): void;
    angleTo(node: Node): number;
    isLeftOf(node: Node): boolean;
}

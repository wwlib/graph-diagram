import { BoundingBox } from '../scaling/Scaling';
import Entity from '../model/Entity';
import Node from '../model/Node';
import Relationship from '../model/Relationship';
export declare type SpeechBubbleTextProperties = {
    keyText: string;
    valueText: string;
    textOrigin: any;
    style: any;
    entity: Node | Relationship;
};
export declare type SpeechBubble = {
    properties: any;
    style: any;
    groupTransform: string;
    outlineTransform: string;
    outlinePath: any;
    boundingBox: any;
    entity: Node | Relationship;
};
export default class Bubble {
    properties: any[];
    style: any;
    entity: Entity;
    groupTransform: string;
    outlineTransform: string;
    outlinePath: string;
    boundingBox: BoundingBox;
    constructor(entity: Entity);
    static speechBubblePath: (textSize: any, style: string, margin: number, padding: number) => string;
}

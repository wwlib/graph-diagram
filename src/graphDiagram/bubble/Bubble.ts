import SimpleStyle from '../model/SimpleStyle';
import {Point, BoundingBox} from '../scaling/Scaling';
import Entity from '../model/Entity';
import Node from '../model/Node';
import Relationship from '../model/Relationship';

// export type Point = {
//     x: number;
//     y: number;
// }

export type SpeechBubbleTextProperties = {
    keyText: string;
    valueText: string;
    textOrigin: any; //Point;
    style: any; //SimpleStyle;
    entity: Node | Relationship;
}

export type SpeechBubble = {
        properties: any;
        style: any; //SimpleStyle;
        groupTransform: string;
        outlineTransform: string;
        outlinePath: any;
        boundingBox: any; //BoundingBox;
        entity: Node | Relationship;
}

export default class Bubble {

    public properties: any[];
    public style: any;
    public entity: Entity;
    public groupTransform: string;
    public outlineTransform: string;
    public outlinePath: string;
    public boundingBox: BoundingBox;

    constructor(entity: Entity) {
        this.entity = entity;
    }

    static speechBubblePath = function(textSize: any, style: string, margin: number, padding: number): string {
        var width = textSize.width, height = textSize.height;
        var styles = {
            diagonal: [
                "M", 0, 0,
                "L", margin + padding, margin,
                "L", margin + width + padding, margin,
                "A", padding, padding, 0, 0, 1, margin + width + padding * 2, margin + padding,
                "L", margin + width + padding * 2, margin + height + padding,
                "A", padding, padding, 0, 0, 1, margin + width + padding, margin + height + padding * 2,
                "L", margin + padding, margin + height + padding * 2,
                "A", padding, padding, 0, 0, 1, margin, margin + height + padding,
                "L", margin, margin + padding,
                "Z"
            ],
            horizontal: [
                "M", 0, 0,
                "L", margin, -padding,
                "L", margin, -height / 2,
                "A", padding, padding, 0, 0, 1, margin + padding, -height / 2 - padding,
                "L", margin + width + padding, -height / 2 - padding,
                "A", padding, padding, 0, 0, 1, margin + width + padding * 2, -height / 2,
                "L", margin + width + padding * 2, height / 2,
                "A", padding, padding, 0, 0, 1, margin + width + padding, height / 2 + padding,
                "L", margin + padding, height / 2 + padding,
                "A", padding, padding, 0, 0, 1, margin, height / 2,
                "L", margin, padding,
                "Z"
            ],
            vertical: [
                "M", 0, 0,
                "L", -padding, margin,
                "L", -width / 2, margin,
                "A", padding, padding, 0, 0, 0, -width / 2 - padding, margin + padding,
                "L", -width / 2 - padding, margin + height + padding,
                "A", padding, padding, 0, 0, 0, -width / 2, margin + height + padding * 2,
                "L", width / 2, margin + height + padding * 2,
                "A", padding, padding, 0, 0, 0, width / 2 + padding, margin + height + padding,
                "L", width / 2 + padding, margin + padding,
                "A", padding, padding, 0, 0, 0, width / 2, margin,
                "L", padding, margin,
                "Z"
            ]
        };
        return styles[style].join(" ");
    }
}

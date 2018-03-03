import Node from '../model/Node';
import LayoutEntity from '../layout/LayoutEntity';
import Radius from '../layout/Radius';
export default class LayoutNode extends LayoutEntity {
    class: any;
    x: number;
    y: number;
    radius: Radius;
    captionLines: string[];
    captionLineHeight: number;
    constructor(graphNode: Node);
    wrapAndMeasureCaption(node: Node): {
        radius: Radius;
        captionLines: string[];
        captionLineHeight: number;
    };
}

import LayoutNode from './layout/LayoutNode';
import LayoutRelationship from './layout/LayoutRelationship';
export default class GraphDiagram {
    static MODEL_ID_KEY: string;
    static parsePixels(fontSize: string): number;
    static measureTextDimensions(text: string, fontSize: string, fontFamily: string): any;
    static hasProperties(entity: LayoutNode | LayoutRelationship): boolean;
}

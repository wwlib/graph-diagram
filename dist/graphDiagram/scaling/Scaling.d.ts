import LayoutModel from '../layout/LayoutModel';
import LayoutNode from '../layout/LayoutNode';
export declare type Point = {
    x: number;
    y: number;
};
export declare type BoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare type Bounds = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};
export default class Scaling {
    static nodeBox(node: LayoutNode): {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
    static boxNormalise(box: BoundingBox): Bounds;
    static boxUnion(boxes: Bounds[]): Bounds;
    static smallestContainingBox(layoutModel: LayoutModel): BoundingBox;
    static centeredOrScaledViewBox(viewDimensions: BoundingBox, diagramExtent: BoundingBox): BoundingBox;
    static effectiveBox(viewBox: BoundingBox, viewSize: BoundingBox): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    static viewDimensions(view: any): BoundingBox;
    static centerOrScaleDiagramToFitSvg(layoutModel: LayoutModel, view: any): void;
    static centerOrScaleDiagramToFitWindow(layoutModel: LayoutModel, view: any): void;
    static centerOrScaleDiagramToFitSvgSmooth(layoutModel: LayoutModel, view: any): void;
    static fitsInside(extent: BoundingBox, box: BoundingBox): boolean;
    static growButDoNotShrink(layoutModel: LayoutModel, view: any): void;
    static sizeSvgToFitDiagram(layoutModel: LayoutModel, view: any): void;
}

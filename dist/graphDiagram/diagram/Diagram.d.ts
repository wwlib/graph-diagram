import Layout from '../layout/Layout';
import LayoutNode from '../layout/LayoutNode';
import LayoutEntity from '../layout/LayoutEntity';
export declare type CaptionLine = {
    node: LayoutNode;
    caption: any;
};
export default class Diagram {
    layout: Layout;
    private _overlay;
    private _scaling;
    private _renderPropertyBubblesFlag;
    constructor();
    overlay(behaviour: any): Diagram;
    scaling(scalingFunction: any): Diagram;
    toggleRenderPropertyBubblesFlag(): void;
    renderNodes(nodes: LayoutNode[], view: any): void;
    renderRelationships(relationshipGroups: any, view: any): void;
    renderPropertyBubbles(entities: LayoutEntity[], descriminator: string, view: any): void;
    render(selection: any): void;
}

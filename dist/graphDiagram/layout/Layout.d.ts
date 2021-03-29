import Model from '../model/Model';
import Relationship from '../model/Relationship';
import LayoutNode from './LayoutNode';
import HorizontalArrowOutline from '../arrow/HorizontalArrowOutline';
import CurvedArrowOutline from '../arrow/CurvedArrowOutline';
export default class Layout {
    layoutModel: any;
    nodesById: Map<string, LayoutNode>;
    constructor(graphModel: Model);
    horizontalArrow(relationship: Relationship, start: LayoutNode, end: LayoutNode, offset: number): CurvedArrowOutline | HorizontalArrowOutline;
}

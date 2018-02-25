import Relationship from '../model/Relationship';
import LayoutEntity from '../layout/LayoutEntity';
import LayoutNode from './LayoutNode';
import HorizontalArrowOutline from '../arrow/HorizontalArrowOutline';
import CurvedArrowOutline from '../arrow/CurvedArrowOutline';
export default class LayoutRelationship extends LayoutEntity {
    start: LayoutNode;
    end: LayoutNode;
    arrow: HorizontalArrowOutline | CurvedArrowOutline;
    constructor(graphRelationship: Relationship, start: LayoutNode, end: LayoutNode, arrow: HorizontalArrowOutline | CurvedArrowOutline);
}

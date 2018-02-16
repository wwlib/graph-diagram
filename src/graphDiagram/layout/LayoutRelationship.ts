import Relationship from '../model/Relationship';
import LayoutEntity from '../layout/LayoutEntity';
import LayoutNode from './LayoutNode';
import HorizontalArrowOutline from '../arrow/HorizontalArrowOutline';
import CurvedArrowOutline from '../arrow/CurvedArrowOutline';
import RelationshipSpeechBubble from '../bubble/RelationshipSpeechBubble';

export default class LayoutRelationship extends LayoutEntity{

    public start: LayoutNode;
    public end: LayoutNode;
    public arrow: HorizontalArrowOutline | CurvedArrowOutline;

    constructor(graphRelationship: Relationship, start: LayoutNode, end: LayoutNode, arrow: HorizontalArrowOutline | CurvedArrowOutline) {
        super(graphRelationship);
        this.start = start;
        this.end = end;
        this.arrow = arrow;
        this.propertiesBubble = new RelationshipSpeechBubble( graphRelationship, arrow.apex );
        this.model = graphRelationship;
    }
}

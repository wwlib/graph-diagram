import GraphDiagram from '../GraphDiagram';
import Model from '../model/Model';
import Node from '../model/Node';
import Relationship from '../model/Relationship';
//import NodeSpeechBubble from '../bubble/NodeSpeechBubble';
//import RelationshipSpeechBubble from '../bubble/RelationshipSpeechBubble';
import LayoutRelationship from './LayoutRelationship';
import LayoutNode from './LayoutNode';
import Radius from '../layout/Radius';
import HorizontalArrowOutline from '../arrow/HorizontalArrowOutline';
import CurvedArrowOutline from '../arrow/CurvedArrowOutline';

export default class Layout {

    public layoutModel: any;
    public nodesById: Map<string, LayoutNode>;

    constructor(graphModel: Model) {
        this.nodesById = new Map<string, LayoutNode>();

        this.layoutModel = {
            graphModel: graphModel,
            nodes: [],
            relationships: [],
            relationshipGroups: []
        };


        graphModel.nodeList().forEach((node: Node) => {
            // var measurement: any = Layout.wrapAndMeasureCaption( node ); //FUNKY //TODO

            var layoutNode = new LayoutNode(node);
            this.nodesById.set(node.id, layoutNode);
            this.layoutModel.nodes.push(layoutNode);
        });

        graphModel.groupedRelationshipList().forEach( (group:any) => {
            var nominatedStart = group[0].start;
            var offsetStep = GraphDiagram.parsePixels( group[0].style( "margin" ) );
            var relationshipGroup = [];
            for ( var i = 0; i < group.length; i++ )
            {
                var relationship: Relationship = group[i];
                if (relationship.start && relationship.end) {
                    var offset: number = (relationship.start === nominatedStart ? 1 : -1) *
                    offsetStep * (i - (group.length - 1) / 2);
                    // console.log(`groupedRelationshipList: offset: ${offset}`);
                    var start: LayoutNode = this.nodesById.get(relationship.start.id);
                    var end: LayoutNode = this.nodesById.get(relationship.end.id);
                    var arrow: HorizontalArrowOutline | CurvedArrowOutline = this.horizontalArrow( relationship, start, end, offset );

                    var layoutRelationship = new LayoutRelationship(relationship, start, end, arrow);
                    relationshipGroup.push( layoutRelationship );
                    this.layoutModel.relationships.push(layoutRelationship);
                }
            }
            this.layoutModel.relationshipGroups.push(relationshipGroup);
        });
    }

    horizontalArrow(relationship: Relationship, start: LayoutNode, end: LayoutNode, offset: number) {
        var length: number = (start.model as Node).distanceTo(end.model as Node);
        var arrowWidth: number = GraphDiagram.parsePixels( relationship.style( "width" ) );
        if (offset === 0)
        {
            return new HorizontalArrowOutline(
                start.radius.startRelationship(),
                (length - end.radius.endRelationship()),
                arrowWidth
            );
        }
        return new CurvedArrowOutline(
            start.radius.startRelationship(),
            end.radius.endRelationship(),
            length,
            offset,
            arrowWidth,
            arrowWidth * 4,
            arrowWidth * 4
        );
    }
}

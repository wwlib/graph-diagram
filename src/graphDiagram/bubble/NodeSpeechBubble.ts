import * as d3 from 'd3';
import GraphDiagram from '../GraphDiagram';
import Model from '../model/Model';
import Properties from '../model/Properties';
import Node from '../model/Node';
import Relationship from '../model/Relationship';
import Radius from './Radius';
import Bubble from './Bubble';
import {Point, BoundingBox} from '../scaling/Scaling';

export default class NodeSpeechBubble extends Bubble {

    constructor( node: Node, radius: Radius )
    {
        super(node);
        var relatedNodes: Node[] = [];
        node.model.relationshipList().forEach( function ( relationship: Relationship )
        {
            if ( relationship.start === node )
            {
                relatedNodes.push( relationship.end );
            }
            if ( relationship.end === node )
            {
                relatedNodes.push( relationship.start );
            }
        } );
        var orientation: any = NodeSpeechBubble.chooseNodeSpeechBubbleOrientation( node, relatedNodes );

        var properties: Properties = node.properties;

        var propertyKeysWidth: string = d3.max( properties.list(), function ( property: any )
            {
                return GraphDiagram.measureTextDimensions( property.key + ": ", node.properties.style( "font-size" ), node.properties.style( "font-family" ) );
            });
        var propertyValuesWidth: string = d3.max( properties.list(), function ( property: any )
        {
            return GraphDiagram.measureTextDimensions( property.value, node.properties.style( "font-size" ), node.properties.style( "font-family" ) );
        } );
        var textSize: any = {
            width: parseFloat(propertyKeysWidth) + parseFloat(propertyValuesWidth),
            height:properties.list().length * GraphDiagram.parsePixels( properties.style("font-size"))
        };

        var mirror: string = "scale(" + orientation.mirrorX + "," + orientation.mirrorY + ") ";

        var margin: number = GraphDiagram.parsePixels( properties.style( "margin" ) );
        var padding: number = GraphDiagram.parsePixels( properties.style( "padding" ) );

        var diagonalRadius: number = radius.mid() * Math.sqrt( 2 ) / 2;
        var nodeOffsetOptions: any = {
            diagonal:{ attach:{ x:diagonalRadius, y:diagonalRadius },
                textCorner:{
                    x:margin + padding,
                    y:margin + padding
                } },
            horizontal:{ attach:{ x:radius.mid(), y:0 },
                textCorner:{
                    x:margin + padding,
                    y:-textSize.height / 2
                } },
            vertical:{ attach:{ x:0, y:radius.mid() },
                textCorner:{
                    x:-textSize.width / 2,
                    y:margin + padding
                } }
        };
        var nodeCenterOffset: any = nodeOffsetOptions[orientation.style].attach;
        var textCorner: any = nodeOffsetOptions[orientation.style].textCorner;

        var translate: string = "translate(" + (node.ex() + nodeCenterOffset.x * orientation.mirrorX) + ","
            + (node.ey() + nodeCenterOffset.y * orientation.mirrorY) + ") ";

        var textOrigin: Point = {
            x: parseFloat(propertyKeysWidth) + orientation.mirrorX * (textCorner.x)
                - (orientation.mirrorX == -1 ? textSize.width : 0),
            y:orientation.mirrorY * (textCorner.y)
                - (orientation.mirrorY == -1 ? textSize.height : 0)
        };

        var boundingPadding: number = padding + node.model.parameters.speechBubbleStrokeWidth / 2;

        var boundingBox: BoundingBox = {
            x:node.ex() + (nodeCenterOffset.x + textCorner.x - boundingPadding) * orientation.mirrorX,
            y:node.ey() + (nodeCenterOffset.y + textCorner.y - boundingPadding) * orientation.mirrorY,
            width:orientation.mirrorX * (textSize.width + (boundingPadding * 2)),
            height:orientation.mirrorY * (textSize.height + (boundingPadding * 2))
        };

        this.properties = properties.list().map( function ( property: any ) {
                return {
                    keyText:property.key + ": ",
                    valueText:property.value,
                    textOrigin:textOrigin,
                    style:node.style(),
                    entity: node
                }
            });
        this.style =node.style();
        this.groupTransform = translate;
        this.outlineTransform = mirror;
        this.outlinePath = Bubble.speechBubblePath( textSize, orientation.style, margin, padding ),
        this.boundingBox = boundingBox;
    }

    static chooseNodeSpeechBubbleOrientation = function(focusNode: Node, relatedNodes: Node[]) {
        var orientations: any[] = [
            { key: "WEST"       , style: "horizontal", mirrorX: -1, mirrorY:  1, angle:  180 },
            { key: "NORTH-WEST" , style: "diagonal",   mirrorX: -1, mirrorY: -1, angle: -135 },
            { key: "NORTH"      , style: "vertical",   mirrorX:  1, mirrorY: -1, angle:  -90 },
            { key: "NORTH-EAST" , style: "diagonal",   mirrorX:  1, mirrorY: -1, angle:  -45 },
            { key: "EAST"       , style: "horizontal", mirrorX:  1, mirrorY:  1, angle:    0 },
            { key: "SOUTH-EAST" , style: "diagonal",   mirrorX:  1, mirrorY:  1, angle:   45 },
            { key: "SOUTH"      , style: "vertical",   mirrorX:  1, mirrorY:  1, angle:   90 },
            { key: "SOUTH-WEST" , style: "diagonal",   mirrorX: -1, mirrorY:  1, angle:  135 }
        ];

        orientations.forEach(function(orientation: any) {
            orientation.closest = 180;
        });

        relatedNodes.forEach(function(relatedNode: Node) {
            orientations.forEach(function(orientation: any) {
                var angle: number = Math.abs(focusNode.angleTo( relatedNode ) - orientation.angle);
                if ( angle > 180 )
                {
                    angle = 360 - angle;
                }
                if (angle < orientation.closest) {
                    orientation.closest = angle;
                }
            });
        });

        var maxAngle: number = 0;
        var bestOrientation: any = orientations[0];
        orientations.forEach(function(orientation: any) {
            if (orientation.closest > maxAngle) {
                maxAngle = orientation.closest;
                bestOrientation = orientation;
            }
        });

        return bestOrientation;
    }
}

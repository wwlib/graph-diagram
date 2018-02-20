import * as d3 from 'd3';
import GraphDiagram from '../GraphDiagram';
import Model from '../model/Model';
import Relationship from '../model/Relationship';
import Bubble from './Bubble';
import {Point, BoundingBox} from '../scaling/Scaling';


export default class RelationshipSpeechBubble extends Bubble {

    constructor( relationship: Relationship, apex: any )
    {
        super(relationship);
        var properties = relationship.properties;
        var fontSize: string = relationship.properties.style( "font-size" );
        var fontFamily: string = relationship.properties.style( "font-family" );

        var orientation = RelationshipSpeechBubble.chooseRelationshipSpeechBubbleOrientation( relationship );

        var propertyKeysWidth = d3.max( properties.listEditable(), function ( property )
        {
            return GraphDiagram.measureTextDimensions( property.key + ": ", fontSize, fontFamily );
        } );
        var propertyValuesWidth = d3.max( properties.listEditable(), function ( property )
        {
            return GraphDiagram.measureTextDimensions( property.value, fontSize, fontFamily );
        } );
        var textSize = {
            width:propertyKeysWidth + propertyValuesWidth,
            height:properties.listEditable().length * GraphDiagram.parsePixels( properties.style( "font-size" ) )
        };

        var margin = GraphDiagram.parsePixels( properties.style( "margin" ) );
        var padding = GraphDiagram.parsePixels( properties.style( "padding" ) );

        var mirror = "scale(" + orientation.mirrorX + "," + orientation.mirrorY + ") ";

        var nodeOffsetOptions = {
            diagonal:{
                textCorner:{
                    x:margin + padding,
                    y:margin + padding
                } },
            horizontal:{
                textCorner:{
                    x:margin + padding,
                    y:-textSize.height / 2
                } },
            vertical:{
                textCorner:{
                    x:-textSize.width / 2,
                    y:margin + padding
                } }
        };
        var textCorner = nodeOffsetOptions[orientation.style].textCorner;

        var dx = relationship.end.ex() - relationship.start.ex();
        var dy = relationship.end.ey() - relationship.start.ey();
        var h = Math.sqrt(dx * dx + dy * dy);

        var midPoint = {
            x: relationship.start.ex() + (apex.x * dx - apex.y * dy) / h,
            y: relationship.start.ey() +(apex.x * dy + apex.y * dx) / h
        };

        var translate = "translate(" + midPoint.x + "," + midPoint.y + ") ";

        var textOrigin: Point = {
            x:propertyKeysWidth + orientation.mirrorX * (textCorner.x)
                - (orientation.mirrorX == -1 ? textSize.width : 0),
            y:orientation.mirrorY * (textCorner.y)
                - (orientation.mirrorY == -1 ? textSize.height : 0)
        };

        var boundingPadding = padding + relationship.model.parameters.speechBubbleStrokeWidth / 2;

        var boundingBox: BoundingBox = {
            x:midPoint.x + (textCorner.x - boundingPadding) * orientation.mirrorX,
            y:midPoint.y + (textCorner.y - boundingPadding) * orientation.mirrorY,
            width:orientation.mirrorX * (textSize.width + (boundingPadding * 2)),
            height:orientation.mirrorY * (textSize.height + (boundingPadding * 2))
        };

        this.properties = properties.listEditable().map( function ( property: any ) {
                return {
                    keyText:property.key + ": ",
                    valueText:property.value,
                    textOrigin:textOrigin,
                    style:relationship.style(),
                    entity: relationship
                }
            });
        this.style = relationship.style();
        this.entity = relationship;
        this.groupTransform = translate;
        this.outlineTransform = mirror;
        this.outlinePath = Bubble.speechBubblePath( textSize, orientation.style, margin, padding );
        this.boundingBox = boundingBox;
    }

    static chooseRelationshipSpeechBubbleOrientation(relationship: Relationship) {
        var orientations: any = {
            EAST:       { style: "horizontal", mirrorX:  1, mirrorY:  1, angle:    0 },
            SOUTH_EAST: { style: "diagonal",   mirrorX:  1, mirrorY:  1, angle:   45 },
            SOUTH     : { style: "vertical",   mirrorX:  1, mirrorY:  1, angle:   90 },
            SOUTH_WEST: { style: "diagonal",   mirrorX: -1, mirrorY:  1, angle:  135 },
            WEST:       { style: "horizontal", mirrorX: -1, mirrorY:  1, angle:  180 }
        };

        var relationshipAngle = relationship.start.angleTo(relationship.end);

        var positiveAngle = relationshipAngle > 0 ? relationshipAngle : relationshipAngle + 180;

        if ( positiveAngle > 175 || positiveAngle < 5 )
        {
            return orientations.SOUTH;
        }
        else if ( positiveAngle < 85 )
        {
            return orientations.SOUTH_WEST
        }
        else if ( positiveAngle < 90 )
        {
            return orientations.WEST;
        }
        else if ( positiveAngle === 90 )
        {
            return relationshipAngle > 0 ? orientations.WEST : orientations.EAST;
        }
        else if ( positiveAngle < 95 )
        {
            return orientations.EAST;
        }
        else
        {
            return orientations.SOUTH_EAST;
        }
    }
}

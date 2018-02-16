import * as d3 from 'd3';
import GraphDiagram from '../GraphDiagram';
import Model from '../model/Model';
import Node from '../model/Node';
import Relationship from '../model/Relationship';
import Layout from '../layout/Layout';
import LayoutModel from '../layout/LayoutModel';
import LayoutNode from '../layout/LayoutNode';
import LayoutEntity from '../layout/LayoutEntity';
import LayoutRelationship from '../layout/LayoutRelationship';
import Scaling from '../scaling/Scaling';
import { SpeechBubble, SpeechBubbleTextProperties } from '../bubble/Bubble';

export type CaptionLine = {
    node: LayoutNode;
    caption: any;
}

var thiz: Diagram;

export default class Diagram {

    private _overlay: any;
    private _scaling: any;

    constructor() {
        this._overlay = function(layoutModel: LayoutModel, view: any) {};
        this._scaling = Scaling.sizeSvgToFitDiagram;
        thiz = this;
    }

    overlay(behaviour: any): Diagram {
        this._overlay = behaviour;
        return this;
    };

    scaling(scalingFunction: any): Diagram {
        this._scaling = scalingFunction;
        return this;
    };

    renderNodes( nodes: LayoutNode[], view: any )
    {
        function nodeClasses(d: LayoutNode) {
            let result = d.model.class().join(" ") + " " + "node-id-" + d.model.id;
            return result;
        }

        var circles = view.selectAll("circle.node").data( nodes );
        circles.exit().remove();

        var circlesEnter: any = circles.enter().append("svg:circle")
            .attr("class", nodeClasses)
            .merge(circles)
            .attr("r", function(node: any) {
                // console.log(`r: `, node);
                return node.radius.mid();
            })
            .attr("fill", function(node: any) {
                return node.model.style("background-color");
            })
            .attr("stroke", function(node: any) {
                return node.model.style("border-color");
            })
            .attr("stroke-width", function(node: any) {
                return node.model.style("border-width");
            })
            .attr("cx", function(node: any) {
                var ex: number = node.model.ex();
                return ex;
            })
            .attr("cy", function(node: any) {
                return node.model.ey();
            });

        function captionClasses(line: CaptionLine) {
            return "caption " + line.node.model.class();
        }

        var nodesWithCaptions = nodes.filter(function(node) { return node.model.caption; });
        var captionGroups = view.selectAll("g.caption")
            .data(nodesWithCaptions);

        captionGroups.exit().remove();

        var captionGroupsEnter = captionGroups.enter().append("g")
            .attr("class", "caption");
        var captionGroupsMerge = captionGroups.merge(captionGroupsEnter);

        var captions = captionGroupsMerge.selectAll("text.caption")
            .data( function ( node: LayoutNode ) {
                var data = node.captionLines.map( function ( line ) {
                    return { node: node, caption: line }
                });
                return data
            });

        captions.exit().remove();

        var captionsEnter = captions.enter().append("svg:text")
            .attr("class", captionClasses);

        var captionsMerge = captions.merge(captionsEnter);

        captionsMerge
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .attr("x", function ( line: CaptionLine ) { return (line.node.model as Node).ex(); })
            .attr("y", function ( line: CaptionLine, i: number ) { return (line.node.model as Node).ey() + (i - (line.node.captionLines.length - 1) / 2) * line.node.captionLineHeight; })
            .attr( "fill", function ( line: CaptionLine ) { return line.node.model.style( "color" ); } )
            .attr( "font-size", function ( line: CaptionLine ) { return line.node.model.style( "font-size" ); } )
            .attr( "font-family", function ( line: CaptionLine ) { return line.node.model.style( "font-family" ); } )
            .text(function(line: CaptionLine) {
                return line.caption;
            });
    }

    renderRelationships( relationshipGroups: any, view: any )
    {
        function translateToStartNodeCenterAndRotateToRelationshipAngle(r: LayoutRelationship) {
            var angle = (r.start.model as Node).angleTo(r.end.model as Node);
            return "translate(" + (r.start.model as Node).ex() + "," + (r.start.model as Node).ey() + ") rotate(" + angle + ")";
        }

        function rotateIfRightToLeft(r: LayoutRelationship) {
            return (r.end.model as Node).isLeftOf( r.start.model as Node ) ? "rotate(180)" : null;
        }

        function side(r: LayoutRelationship) {
            return (r.end.model as Node).isLeftOf(r.start.model as Node) ? -1 : 1;
        }

        function relationshipClasses(d: LayoutNode) {
            var r: Relationship = d.model as Relationship;
            return r.class().join(" ");
        }

        var relatedNodesGroup = view.selectAll("g.related-pair")
            .data(relationshipGroups);

        relatedNodesGroup.exit().remove();

        var relatedNodesGroupEnter = relatedNodesGroup.enter().append("svg:g")
            .attr("class", "related-pair");
        var relatedNodesGroupMerge = relatedNodesGroup.merge(relatedNodesGroupEnter);


        var relationshipGroup = relatedNodesGroupMerge.selectAll( "g.relationship" )
            .data( function(d: LayoutNode) { return d; } );

        relationshipGroup.exit().remove();

        var relationshipGroupEnter = relationshipGroup.enter().append("svg:g")
            .attr("class", relationshipClasses)
        var relationshipGroupMerge = relationshipGroup.merge(relationshipGroupEnter);

        relationshipGroupMerge
            .attr("transform", translateToStartNodeCenterAndRotateToRelationshipAngle);

        var relationshipPath = relationshipGroupMerge.selectAll("path.relationship")
            .data( function(d: any) {return [d] } );

        var relationshipPathEnter = relationshipPath.enter().append("svg:path")
            .attr("class", relationshipClasses);

        var relationshipPathMerge = relationshipPath.merge(relationshipPathEnter);

        relationshipPathMerge
            .attr( "d", function(d: LayoutRelationship) { return d.arrow.outline; } )
            .attr( "fill", function(node: LayoutRelationship) {
                return node.model.style("background-color");
            })
            .attr("stroke", function(node: LayoutRelationship) {
                return node.model.style("border-color");
            })
            .attr("stroke-width", function(node: LayoutRelationship) {
                return node.model.style("border-width");
            });

        function relationshipWithRelationshipType(d: LayoutRelationship) {
            return [d].filter(function(d) { return (d.model as Relationship).relationshipType; });
        }

        var relationshipType = relationshipGroupMerge.selectAll("text.type")
            .data(relationshipWithRelationshipType);

        relationshipType.exit().remove();

        var relationshipTypeEnter = relationshipType.enter().append("svg:text")
            .attr("class", "type")
            .attr("text-anchor", "middle")
            .attr("baseline-shift", "30%")
            .attr("alignment-baseline", "alphabetic");
        var relationshipTypeMerge = relationshipType.merge(relationshipTypeEnter);

        relationshipTypeMerge
            .attr("transform", rotateIfRightToLeft)
            .attr("x", function(d: LayoutRelationship) { return side( d ) * d.arrow.apex.x; } )
            .attr("y", function(d: LayoutRelationship) { return side( d ) * d.arrow.apex.y; } )
            .attr( "font-size", function ( d: LayoutRelationship ) { return d.model.style( "font-size" ); } )
            .attr( "font-family", function ( d: LayoutRelationship ) { return d.model.style( "font-family" ); } )
            .text( function ( d: LayoutRelationship ) { return (d.model as Relationship).relationshipType; } );
    }

    renderPropertyBubbles( entities: LayoutEntity[], descriminator: string, view: any )
    {
        var entitiesWithProperties: LayoutEntity[] = entities.filter( GraphDiagram.hasProperties );
        var propertiesData: any = entitiesWithProperties.map( function(entity: LayoutEntity) { return entity.propertiesBubble; } );
        var speechBubbleGroup = view.selectAll( "g.speech-bubble." + descriminator + "-speech-bubble" )
            .data( propertiesData );

        speechBubbleGroup.exit().remove();

        var speechBubbleGroupEnter = speechBubbleGroup.enter().append( "svg:g" )
            .attr( "class", "speech-bubble " + descriminator + "-speech-bubble" );
        var speechBubbleGroupMerge = speechBubbleGroup.merge(speechBubbleGroupEnter);

        speechBubbleGroupMerge
            .attr( "transform", function ( speechBubble: SpeechBubble )
            {
                return speechBubble.groupTransform;
            } );

        var speechBubbleOutline = speechBubbleGroupMerge.selectAll( "path.speech-bubble-outline" )
            .data( function(d: any) {return [d] } );

        speechBubbleOutline.exit().remove();

        var speechBubbleOutlineEnter = speechBubbleOutline.enter().append( "svg:path" )
            .attr( "class", "speech-bubble-outline" );
        var speechBubbleOutlineMerge = speechBubbleOutline.merge(speechBubbleOutlineEnter);

        speechBubbleOutlineMerge
            .attr( "transform", function ( speechBubble: SpeechBubble )
            {
                return speechBubble.outlineTransform;
            } )
            .attr( "d", function ( speechBubble: SpeechBubble )
            {
                return speechBubble.outlinePath;
            } )
            .attr( "fill", function ( speechBubble: SpeechBubble )
            {
                return speechBubble.entity.properties.style( "background-color" );
            } )
            .attr( "stroke", function ( speechBubble: SpeechBubble )
            {
                return speechBubble.entity.properties.style( "border-color" );
            } )
            .attr( "stroke-width", function ( speechBubble: SpeechBubble )
            {
                return speechBubble.entity.properties.style( "border-width" );
            } );

        var propertyKeys = speechBubbleGroupMerge.selectAll( "text.speech-bubble-content.property-key" )
            .data( function ( speechBubble: SpeechBubble )
            {
                return speechBubble.properties;
            } );

        propertyKeys.exit().remove();

        var propertyKeysEnter = propertyKeys.enter().append( "svg:text" )
            .attr( "class", "speech-bubble-content property-key" );
        var propertyKeysEnterMerge = propertyKeys.merge(propertyKeysEnter);

        propertyKeysEnterMerge
            .attr( "x", function ( properties: SpeechBubbleTextProperties )
            {
                return properties.textOrigin.x;
            } )
            .attr( "y", function ( properties: SpeechBubbleTextProperties, i: number )
            {
                return (i + 0.5) * GraphDiagram.parsePixels( properties.entity.properties.style( "font-size" ) ) + properties.textOrigin.y
            } )
            .attr( "alignment-baseline", "central" )
            .attr( "text-anchor", "end" )
            .attr( "font-size", function ( properties: SpeechBubbleTextProperties ) { return properties.entity.properties.style( "font-size" ); } )
            .attr( "font-family", function ( properties: SpeechBubbleTextProperties ) { return properties.entity.properties.style( "font-family" ); } )
            .attr( "xml:space", "preserve" )
            .text( function ( properties: SpeechBubbleTextProperties )
            {
                return properties.keyText;
            } );

        var propertyValues = speechBubbleGroupMerge.selectAll( "text.speech-bubble-content.property-value" )
            .data( function ( speechBubble: SpeechBubble )
            {
                // console.log(`propertyValues: data: `, speechBubble);
                return speechBubble.properties;
            } );

        propertyValues.exit().remove();

        var propertyValuesEnter = propertyValues.enter().append( "svg:text" )
            .attr( "class", "speech-bubble-content property-value" );

        var propertyValuesMerge = propertyValues.merge(propertyValuesEnter);

        propertyValuesMerge
            .attr( "x", function ( properties: SpeechBubbleTextProperties )
            {
                return properties.textOrigin.x;
            } )
            .attr( "y", function ( properties: SpeechBubbleTextProperties, i: number )
            {
                return (i + 0.5) * GraphDiagram.parsePixels( properties.entity.properties.style( "font-size" ) ) + properties.textOrigin.y
            } )
            .attr( "alignment-baseline", "central" )
            .attr( "font-size", function ( properties: SpeechBubbleTextProperties ) { return properties.entity.properties.style( "font-size" ); } )
            .attr( "font-family", function ( properties: SpeechBubbleTextProperties ) { return properties.entity.properties.style( "font-family" ); } )
            .text( function ( properties: SpeechBubbleTextProperties )
            {
                return properties.valueText;
            } );
    }

    render( selection: any )
    {
        selection.each( function ( model: Model )
        {
            var view = d3.select( this );
            let layout: Layout = new Layout(model);
            var layoutModel = layout.layoutModel;
            // console.log(`Diagram.render: model:`, model);
            // console.log(`Diagram.render: layoutModel:`, layoutModel);

            function layer(name: string)
            {
                var layer = view.selectAll( "g.layer." + name ).data( [name] );
                var layerEnter = layer.enter().append("g")
                        .attr("class", "layer " + name);

                var result = layer.merge(layerEnter);
                return result;
            }

            thiz.renderRelationships( layoutModel.relationshipGroups, layer("relationships") );
            thiz.renderNodes( layoutModel.nodes, layer("nodes") );

            thiz.renderPropertyBubbles( layoutModel.nodes, "node", layer("node_properties") );
            thiz.renderPropertyBubbles( layoutModel.relationships, "relationship", layer("relationship_properties") );

            thiz._overlay( layoutModel, layer("overlay") );
            thiz._scaling( layoutModel, view );
        });
    }
}

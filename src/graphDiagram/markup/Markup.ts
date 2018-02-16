import * as d3 from 'd3';
import GraphDiagram from '../GraphDiagram';
import Model from '../model/Model';
import Node from '../model/Node';
import Relationship from '../model/Relationship';
import SimpleStyle from '../model/SimpleStyle';

export default class Markup {

    static parseAll(selection: any)
    {
        var models: any[] = [];
        selection.each( function ()
        {
            var selx = d3.select( this );
            var modelx =  Markup.parse( selx );
            // console.log(this, selx, modelx);
            // debugger;
            models.push( modelx );
        });
        return models;
    }

    static parseProperties(entity: Node | Relationship, debug: boolean = false)
    {
        return function() {
            var propertiesMarkup = d3.select( this );
            if (debug) {
                console.log(`parseProperties:`,entity, this, propertiesMarkup);
            }
            var elements: any = propertiesMarkup.selectAll( "dt, dd" );
            var currentKey: string;
            elements.each( function () {
                if ( this.nodeName.toLowerCase() === "dt" ) {
                    currentKey = d3.select( this ).text();
                } else if ( currentKey && this.nodeName.toLowerCase() === "dd" ) {
                    entity.properties.set( currentKey, d3.select( this ).text());
                }
            });

            SimpleStyle.copyStyles(entity.properties, propertiesMarkup, debug);
        }
    }

    static parse(selection: any) {
        var model: Model = new Model();

        if (selection.attr("data-internal-scale")) {
            model.internalScale =selection.attr("data-internal-scale");
        }
        if (selection.attr("data-external-scale")) {
            model.externalScale = selection.attr("data-external-scale");
        }

        var nodePrototype = selection.append("li" ).attr("class", "node");
        var nodePropertiesPrototype = nodePrototype.append("dl" ).attr("class", "properties");
        SimpleStyle.copyStyles(model.stylePrototype.node, nodePrototype);
        SimpleStyle.copyStyles(model.stylePrototype.nodeProperties, nodePropertiesPrototype);
        nodePrototype.remove();

        var relationshipPrototype = selection.append("li" ).attr("class", "relationship");
        var relationshipPropertiesPrototype = relationshipPrototype.append("dl" ).attr("class", "properties");
        SimpleStyle.copyStyles(model.stylePrototype.relationship, relationshipPrototype);
        SimpleStyle.copyStyles(model.stylePrototype.relationshipProperties, relationshipPropertiesPrototype);
        relationshipPrototype.remove();

        selection.selectAll(".node").each(function () {
            var nodeMarkup: any = d3.select(this); //TODO
            var id: string = nodeMarkup.attr("data-node-id");
            var node: Node = model.createNode(id);
            node.class(nodeMarkup.attr("class") || "");
            node.x = parseFloat(nodeMarkup.attr("data-x"));
            node.y = parseFloat(nodeMarkup.attr("data-y"));
            nodeMarkup.select("span.caption").each(function() {
                node.caption = d3.select(this).text(); //TODO
            });
            nodeMarkup.select( "dl.properties" ).each( Markup.parseProperties( node ) );

            SimpleStyle.copyStyles(node, nodeMarkup);
        });

        selection.selectAll(".relationship").each(function () {
            // console.log(`parsing relationship:`, this)
            var relationshipMarkup = d3.select(this); //TODO
            var fromId = parseFloat(relationshipMarkup.attr("data-from"));
            var toId = parseFloat(relationshipMarkup.attr("data-to"));
            var relationship: Relationship = model.createRelationship(model.lookupNode(fromId), model.lookupNode(toId));
            relationship.class(relationshipMarkup.attr("class") || "");
            relationshipMarkup.select("span.type" ).each(function() {
                relationship.relationshipType = d3.select(this).text();
                // console.log(`span.type:`, this, relationship.relationshipType);
            });
            // console.log(`relationshipMarkup:`, relationshipMarkup, relationship.relationshipType);
            var temp = relationshipMarkup.select( "dl.properties" ).each( Markup.parseProperties( relationship, false ) );
            // console.log(temp);
            SimpleStyle.copyStyles(relationship, relationshipMarkup, false);
            // console.log(relationship);
        });

        return model;
    }

    static format(model: Model, container: any) {
        var ul = container.append("ul")
            .attr("class", "graph-diagram-markup")
            .attr("data-internal-scale", model.internalScale)
            .attr("data-external-scale", model.externalScale);

        function formatProperties( entity: any, li: any )
        {
            if ( entity.properties.list().length > 0 )
            {
                var dl = li.append( "dl" )
                    .attr( "class", "properties" );

                entity.properties.list().forEach( function ( property: any )
                {
                    dl.append( "dt" )
                        .text( property.key );
                    dl.append( "dd" )
                        .text( property.value );
                } );
            }
        }

        model.nodeList().forEach(function(node) {
            var li = ul.append("li")
                .attr("class", node.class().join(" "))
                .attr("data-node-id", node.id)
                .attr("data-x", node.x)
                .attr("data-y", node.y)

            if (node.caption) {
                li.append("span")
                    .attr("class", "caption")
                    .text(node.caption);
            }
            formatProperties( node, li );
        });

        model.relationshipList().forEach(function(relationship: Relationship) {
            var li = ul.append("li")
                .attr("class", relationship.class().join(" "))
                .attr("data-from", relationship.start.id)
                .attr("data-to", relationship.end.id);

            if (relationship.relationshipType) {
                li.append("span")
                    .attr("class", "type")
                    .text(relationship.relationshipType);
            }
            formatProperties( relationship, li );
        });
    }
}

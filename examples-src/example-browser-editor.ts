console.log(`graph-diagram: Typescript Browser Editor:`);

import {
    ArrayLike,
    selection,
    select,
    selectAll,
    Selection,
    event
} from 'd3-selection';
import { drag } from 'd3-drag';
import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';

import {
  Diagram,
  Markup,
  Model,
  ModelToCypher,
  Node,
  Relationship,
  Scaling,
  LayoutModel,
  LayoutNode
} from '../src/index';

    var graphModel: Model;
    var newNode: Node = null;
    var newRelationship: Relationship = null;
    var graphName: string = 'default';

    loadGraph();

    // if ( !localStorage.getItem( getGraphName() ) )
    // {
    //     graphModel = new Model();
    //     newNode = graphModel.createNode();
    //     newNode.x = 0;
    //     newNode.y = 0;
    //     save( formatMarkup() );
    // }
    // if ( localStorage.getItem( "graph-diagram-style" ) )
    // {
    //     select( "link.graph-style" )
    //         .attr( "href", localStorage.getItem( "graph-diagram-style" ) );
    // }
    // graphModel = parseMarkup( localStorage.getItem( getGraphName() ) );

    var svg = select("#canvas")
        .append("svg:svg")
        .attr("class", "graphdiagram");

    console.log(`svg:`,svg);

    var diagram = new Diagram()
        .scaling(Scaling.centerOrScaleDiagramToFitSvg)
        .overlay(function(layoutModel: LayoutModel, view: any) {
            var nodeOverlays = view.selectAll("circle.node.overlay")
                .data(layoutModel.nodes);

            nodeOverlays.exit().remove();

            var nodeOverlaysEnter = nodeOverlays.enter().append("circle")
                .attr("class", "node overlay");

            var merge = nodeOverlays.merge(nodeOverlaysEnter);

            merge
                .call(drag().on("start", dragStart).on( "drag", dragNode ).on( "end", dragEnd ) )
                .on( "dblclick", editNode )
                .attr("r", function(node: LayoutNode) {
                    return node.radius.outside();
                })
                .attr("stroke", "none")
                .attr("fill", "rgba(255, 255, 255, 0)")
                .attr("cx", function(node: LayoutNode) {
                    let graphNode: Node = node.model as Node;
                    return graphNode.ex();
                })
                .attr("cy", function(node: LayoutNode) {
                    let graphNode: Node = node.model as Node;
                    return graphNode.ey();
                });

            var nodeRings = view.selectAll("circle.node.ring")
                .data(layoutModel.nodes);

            nodeRings.exit().remove();

            var nodeRingsEnter = nodeRings.enter().append("circle")
                .attr("class", "node ring");

            var merge = nodeRings.merge(nodeRingsEnter);

            merge
                .call(drag().on( "drag", dragRing ).on( "end", dragEnd ) )
                .attr("r", function(node: LayoutNode) {
                    return node.radius.outside() + 5;
                })
                .attr("fill", "none")
                .attr("stroke", "rgba(255, 255, 255, 0)")
                .attr("stroke-width", "10px")
                .attr("cx", function(node: LayoutNode) {
                    let graphNode: Node = node.model as Node;
                    return graphNode.ex();
                })
                .attr("cy", function(node: LayoutNode) {
                    let graphNode: Node = node.model as Node;
                    return graphNode.ey();
                });

            var relationshipsOverlays = view.selectAll("path.relationship.overlay")
                .data(layoutModel.relationships);

            relationshipsOverlays.exit().remove();

            var relationshipsOverlaysEnter = relationshipsOverlays.enter().append("path")
                .attr("class", "relationship overlay");

            var merge = relationshipsOverlays.merge(relationshipsOverlaysEnter);

            merge
                .attr("fill", "rgba(255, 255, 255, 0)")
                .attr("stroke", "rgba(255, 255, 255, 0)")
                .attr("stroke-width", "10px")
                .on( "dblclick", editRelationship )
                .attr("transform", function(r: any) {
                    var angle = r.start.model.angleTo(r.end.model);
                    return "translate(" + r.start.model.ex() + "," + r.start.model.ey() + ") rotate(" + angle + ")";
                } )
                .attr("d", function(d: any) { return d.arrow.outline; } );
        });

    function getGraphName(): string {
      return `graph-diagram-markup-${graphName}`;
    }

    function draw()
    {
        // console.log(`draw: `, svg);
        if (graphModel && diagram && diagram.render) {
          svg
              .data([graphModel])
              .call(diagram.render);

          updateSvgDownloadLink();
        }
    }

    function testRender(selection: any) {
        console.log(`testRender:`,this, selection);
        selection.each( function ( model: Model ) {
            console.log(this, model);
        });
    }

    function save( markup: any )
    {
        localStorage.setItem( getGraphName(), markup );
        //localStorage.setItem( "graph-diagram-style", select( "link.graph-style" ).attr( "href" ) );
    }

    function findClosestOverlappingNode( node: any )
    {
        var closestNode = null;
        var closestDistance = Number.MAX_VALUE;

        var allNodes = graphModel.nodeList();

        for ( var i = 0; i < allNodes.length; i++ )
        {
            var candidateNode = allNodes[i];
            if ( candidateNode !== node )
            {
                var candidateDistance = node.distanceTo( candidateNode ) * graphModel.internalScale;
                if ( candidateDistance < 50 && candidateDistance < closestDistance )
                {
                    closestNode = candidateNode;
                    closestDistance = candidateDistance;
                }
            }
        }
        return closestNode;
    }

    function dragStart() {
        // console.log(`dragStart: ${event.x}, ${event.y}`, this);
        newNode = null;
    }

    function dragNode()
    {
        var layoutNode: LayoutNode = this.__data__ as LayoutNode;
        var graphNode: Node = layoutNode.model as Node;
        graphNode.drag(event.dx, event.dy);
        diagram.scaling(Scaling.growButDoNotShrink);
        draw();
    }

    function dragRing()
    {
        // console.log(`dragRing: ${event.x}, ${event.y}`);
        var node: Node = this.__data__.model as Node;
        if ( !newNode )
        {
            newNode = graphModel.createNode();
            newNode.x = event.x;
            newNode.y = event.y;
            // console.log(`dragRing: newRelationship ${node.id}, ${newNode.id}`);
            newRelationship = graphModel.createRelationship( node, newNode );
        }
        var connectionNode = findClosestOverlappingNode( newNode );
        if ( connectionNode )
        {
            newRelationship.end = connectionNode
        } else
        {
            newRelationship.end = newNode;
        }
        // node = newNode;
        newNode.drag(event.dx, event.dy);
        diagram.scaling(Scaling.growButDoNotShrink);
        draw();
    }

    function dragEnd()
    {
        // console.log(`dragEnd: ${event.x}, ${event.y}`, this);
        if ( newNode )
        {
            newNode.dragEnd();
            if ( newRelationship && newRelationship.end !== newNode )
            {
                graphModel.deleteNode( newNode );
            }
        }
        newNode = null;
        save( formatMarkup() );
        diagram.scaling(Scaling.centerOrScaleDiagramToFitSvgSmooth);
        draw();
    }

    select( "#add_node_button" ).on( "click", function ()
    {
        newNode = graphModel.createNode();
        newNode.x =0;
        newNode.y = 0;
        save( formatMarkup() );
        draw();
    } );

    function onControlEnter(saveChange: any)
    {
        return function()
        {
            if ( event.ctrlKey && event.keyCode === 13 )
            {
                saveChange();
            }
        }
    }

    function editNode()
    {
        var editor = select(".pop-up-editor.node");
        appendModalBackdrop();
        editor.classed( "hide", false );

        var node = this.__data__.model;

        var captionField: any = editor.select("#node_caption");
        captionField.node().value = node.caption || "";
        captionField.node().select();

        var propertiesField: any = editor.select("#node_properties");
        propertiesField.node().value = node.properties.list().reduce(function(previous: string, property: any) {
            return previous + property.key + ": " + property.value + "\n";
        }, "");

        function saveChange()
        {
            node.caption = captionField.node().value;
            node.properties.clearAll();
            propertiesField.node().value.split("\n").forEach(function(line: string) {
                var tokens = line.split(/: */);
                if (tokens.length === 2) {
                    var key = tokens[0].trim();
                    var value = tokens[1].trim();
                    if (key.length > 0 && value.length > 0) {
                        node.properties.set(key, value);
                    }
                }
            });
            save( formatMarkup() );
            draw();
            cancelModal();
        }

        function deleteNode()
        {
            graphModel.deleteNode(node);
            save( formatMarkup() );
            draw();
            cancelModal();
        }

        captionField.on("keypress", onControlEnter(saveChange) );
        propertiesField.on("keypress", onControlEnter(saveChange) );

        editor.select("#edit_node_save").on("click", saveChange);
        editor.select("#edit_node_delete").on("click", deleteNode);
    }

    function editRelationship()
    {
        var editor = select(".pop-up-editor.relationship");
        appendModalBackdrop();
        editor.classed( "hide", false );

        var relationship = this.__data__.model;

        var relationshipTypeField: any = editor.select("#relationship_type");
        relationshipTypeField.node().value = relationship.relationshipType || "";
        relationshipTypeField.node().select();

        var propertiesField: any = editor.select("#relationship_properties");
        propertiesField.node().value = relationship.properties.list().reduce(function(previous: string, property: any) {
            return previous + property.key + ": " + property.value + "\n";
        }, "");

        function saveChange()
        {
            relationship.relationshipType = relationshipTypeField.node().value;
            relationship.properties.clearAll();
            propertiesField.node().value.split("\n").forEach(function(line: string) {
                var tokens = line.split(/: */);
                if (tokens.length === 2) {
                    var key = tokens[0].trim();
                    var value = tokens[1].trim();
                    if (key.length > 0 && value.length > 0) {
                        relationship.properties.set(key, value);
                    }
                }
            });
            save( formatMarkup() );
            draw();
            cancelModal();
        }

        function reverseRelationship()
        {
            relationship.reverse();
            save( formatMarkup() );
            draw();
            cancelModal();
        }

        function deleteRelationship()
        {
            graphModel.deleteRelationship(relationship);
            save( formatMarkup() );
            draw();
            cancelModal();
        }

        relationshipTypeField.on("keypress", onControlEnter(saveChange) );
        propertiesField.on("keypress", onControlEnter(saveChange) );

        editor.select("#edit_relationship_save").on("click", saveChange);
        editor.select("#edit_relationship_reverse").on("click", reverseRelationship);
        editor.select("#edit_relationship_delete").on("click", deleteRelationship);
    }

    function formatMarkup()
    {
        var container: any = select( "body" ).append( "div" );
        Markup.format( graphModel, container );
        var markup: any = container.node().innerHTML;
        markup = markup
            .replace( /<li/g, "\n  <li" )
            .replace( /<span/g, "\n    <span" )
            .replace( /<\/span><\/li/g, "</span>\n  </li" )
            .replace( /<\/ul/, "\n</ul" );
        container.remove();
        return markup;
    }

    function cancelModal()
    {
        selectAll( ".modal" ).classed( "hide", true );
        selectAll( ".modal-backdrop" ).remove();
    }

    selectAll( ".btn.cancel" ).on( "click", cancelModal );
    selectAll( ".modal" ).on( "keyup", function() { if ( event.keyCode === 27 ) cancelModal(); } );

    function appendModalBackdrop()
    {
        select( "body" ).append( "div" )
            .attr( "class", "modal-backdrop" )
            .on( "click", cancelModal );
    }

    var exportMarkup = function ()
    {
        appendModalBackdrop();
        select( ".modal.export-markup" ).classed( "hide", false );

        var markup: any = formatMarkup();
        var temp: any;
        temp = select( "textarea.code" )
            .attr( "rows", markup.split( "\n" ).length * 2 )
            .node();
        temp.value = markup;
    };

    function loadGraph()
    {
      var graphNameElementValue: any = select("#graphName").property("value");
      console.log(`graphNameElement:`, graphNameElementValue);
      if (graphNameElementValue) {
        graphName = graphNameElementValue;
      } else {
        graphName = "default";
      }
      if ( !localStorage.getItem( getGraphName() ) )
      {
          graphModel = new Model();
          newNode = graphModel.createNode();
          newNode.x = 0;
          newNode.y = 0;
          save( formatMarkup() );
      }
      graphModel = parseMarkup( localStorage.getItem( getGraphName() ) );
      draw();
    }

    var resetGraph = function()
    {
      graphModel = new Model();
      newNode = graphModel.createNode();
      newNode.x = 0;
      newNode.y = 0;
      save( formatMarkup() );
      draw();
    }

    function parseMarkup( markup: any )
    {
        var container: any = select( "body" ).append( "div" );
        container.node().innerHTML = markup;
        var model = Markup.parse( container.select("ul.graph-diagram-markup") );
        container.remove();
        return model;
    }

    var useMarkupFromMarkupEditor = function ()
    {
        var temp: any = select( "textarea.code" ).node();
        var markup = temp.value;
        graphModel = parseMarkup( markup );
        save( markup );
        draw();
        cancelModal();
    };

    select( "#save_markup" ).on( "click", useMarkupFromMarkupEditor );

    function updateSvgDownloadLink() {
        var temp: any = select("#canvas svg" ).node();
      var rawSvg: any = new XMLSerializer().serializeToString(temp);
      select("#downloadSvgButton").attr('href', "data:image/svg+xml;base64," + btoa( rawSvg ));
    }

    var openConsoleWithCypher = function (evt: any)
    {
        var temp: any = select(".export-cypher .modal-body textarea.code").node();
        var cypher = temp.value;
        cypher = cypher.replace(/\n  /g," ");
        var url="http://console.neo4j.org"+
            "?init=" + encodeURIComponent(cypher)+
            "&query=" + encodeURIComponent("start n=node(*) return n");
        select( "#open_console" )
                    .attr( "href", url );
        return true;
    };

    select( "#open_console" ).on( "click", openConsoleWithCypher );

    var exportCypher = function ()
    {
        appendModalBackdrop();
        select( ".modal.export-cypher" ).classed( "hide", false );

        var statement = ModelToCypher.convert(graphModel);
        var selection: any = select( ".export-cypher .modal-body textarea.code" )
            .attr( "rows", statement.split( "\n" ).length );

        selection.node().value = statement;
    };


    var chooseStyle = function()
    {
        appendModalBackdrop();
        select( ".modal.choose-style" ).classed( "hide", false );
    };

    select("#saveStyle" ).on("click", function() {
        var selectedStyle = selectAll("input[name=styleChoice]" );
        console.log(selectedStyle);
        //TODO use new 4v Selection structure. Cannot index into the array directly
        // selectedStyle[0]
        //     .filter(function(input: any) { return input.checked; })[0].value;
        // select("link.graph-style")
        //     .attr("href", "css/" + selectedStyle);
        //
        // graphModel = parseMarkup( localStorage.getItem( getGraphName() ) );
        // save(formatMarkup());
        // draw();
        // cancelModal();
    });

    function changeInternalScale() {
        var temp: any = select("#internalScale").node();
        graphModel.internalScale = temp.value;
        draw();
    }
    var temp: any = select("#internalScale").node();
    temp.value = graphModel.internalScale;

    select(window).on("resize", draw);
    select("#internalScale" ).on("change", changeInternalScale);
    select( "#exportMarkupButton" ).on( "click", exportMarkup );
	  select( "#exportCypherButton" ).on( "click", exportCypher );
    select( "#chooseStyleButton" ).on( "click", chooseStyle );
    select( "#load" ).on( "click", loadGraph );
    select( "#reset" ).on( "click", resetGraph );

    selectAll( ".modal-dialog" ).on( "click", function ()
    {
        event.stopPropagation();
    } );

    draw();

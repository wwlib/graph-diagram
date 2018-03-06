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
import * as d3Zoom from 'd3-zoom';

import {
  Diagram,
  Markup,
  Model,
  ModelToCypher,
  ModelToD3,
  Node,
  Relationship,
  Scaling,
  LayoutModel,
  LayoutNode
} from '../src/index';

    var graphModel: Model;
    var newNode: Node = null;
    var newRelationship: Relationship = null;
    var graphName: string = "example";
    var exampleMarkup: string = `
    <ul class="graph-diagram-markup" data-internal-scale="1" data-external-scale="1">
      <li class="node" data-node-id="0" data-x="672" data-y="193.5">
        <span class="caption">Food</span><dl class="properties"></dl></li>
      <li class="node" data-node-id="1" data-x="672" data-y="370.5">
        <span class="caption">Pizza</span><dl class="properties"><dt>name</dt><dd>Special</dd></dl></li>
      <li class="node" data-node-id="2" data-x="802" data-y="545.5">
        <span class="caption">Topping</span><dl class="properties"><dt>name</dt><dd>cheese</dd></dl></li>
      <li class="node" data-node-id="3" data-x="599" data-y="566.5">
        <span class="caption">Topping</span><dl class="properties"><dt>name</dt><dd>Pepperoni</dd></dl></li>
      <li class="node" data-node-id="4" data-x="439" data-y="449.5">
        <span class="caption">Topping</span><dl class="properties"><dt>name</dt><dd>sausage</dd></dl></li>
      <li class="node" data-node-id="5" data-x="894" data-y="391.5">
        <span class="caption">Crust</span><dl class="properties"><dt>name</dt><dd>Deep Dish</dd></dl></li>
      <li class="node" data-node-id="6" data-x="488" data-y="258.5">
        <span class="caption">User</span><dl class="properties"><dt>name</dt><dd>Michael</dd></dl></li>
      <li class="relationship" data-from="1" data-to="0">
        <span class="type">IS_A</span><dl class="properties"></dl></li>
      <li class="relationship" data-from="1" data-to="2">
        <span class="type">HAS</span><dl class="properties"></dl></li>
      <li class="relationship" data-from="1" data-to="3">
        <span class="type">HAS</span><dl class="properties"></dl></li>
      <li class="relationship" data-from="1" data-to="4">
        <span class="type">HAS</span><dl class="properties"></dl></li>
      <li class="relationship" data-from="6" data-to="1">
        <span class="type">LIKES</span><dl class="properties"></dl></li>
      <li class="relationship" data-from="1" data-to="5">
        <span class="type">HAS</span><dl class="properties"></dl></li>
    </ul>
    `;

    save(exampleMarkup);

    loadGraph();

    var svg: any;

    var diagram = new Diagram()
        // .scaling(Scaling.centerOrScaleDiagramToFitSvg)
        .scaling(null)
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

    function getLocalStorageGraphName(): string {
      return `graph-diagram-markup-${graphName}`;
    }

    var localStorageItemName: string;
    var graphList: string[] = [];
    function getGraphList(): string[] {
        for(localStorageItemName in localStorage)
        {
            if (localStorageItemName.indexOf("graph-diagram-markup-") >= 0) {
                var parts: string[] = localStorageItemName.split("graph-diagram-markup-");
                var graphName: string = parts[1];
                graphList.push(graphName);
            }
        }
        return graphList;
    }

    function draw()
    {
        if (graphModel && diagram && diagram.render) {
          svg
              .data([graphModel])
              .call(diagram.render);
        }
    }

    function save( markup: any )
    {
        localStorage.setItem( getLocalStorageGraphName(), markup );
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
        //diagram.scaling(Scaling.growButDoNotShrink);
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
        //diagram.scaling(Scaling.growButDoNotShrink);
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
        //diagram.scaling(Scaling.centerOrScaleDiagramToFitSvgSmooth);
        draw();
    }

    select( "#add_node_button" ).on( "click", function ()
    {
        newNode = graphModel.createNode();
        var svgElement = document.getElementById('svgElement')
        newNode.x = svgElement.clientWidth / 2;
        newNode.y = svgElement.clientHeight / 2;
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
        propertiesField.node().value = node.properties.listEditable().reduce(function(previous: string, property: any) {
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
        propertiesField.node().value = relationship.properties.listEditable().reduce(function(previous: string, property: any) {
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
      if (svg) {
        select("svg").remove();
        svg = null;
      }

      svg = select("#svgContainer")
         .append("svg:svg")
         .attr("class", "graphdiagram")
         .attr("id", "svgElement")
         .attr("width", "100%")
         .attr("height", "100%")
         .call(d3Zoom.zoom().on("zoom", function () {
            svg.attr("transform", event.transform)
         }))
         .on("dblclick.zoom", null)
         .append("g")

      var svgElement = document.getElementById('svgElement');
      var x = svgElement.clientWidth / 2;
      var y = svgElement.clientHeight / 2;

      var w = 10,
      h = 10,
      s = '#999999',
      so = 0.5,
      sw = '1px';

      svg.append('line')
          .attr('x1', x - w / 2)
          .attr('y1', y)
          .attr('x2', x + w / 2)
          .attr('y2', y)
          .style('stroke', s)
          .style('stroke-opacity', so)
          .style('stroke-width', sw);

      svg.append('line')
          .attr('x1', x)
          .attr('y1', y - h / 2)
          .attr('x2', x)
          .attr('y2', y + h / 2)
          .style('stroke', s)
          .style('stroke-opacity', so)
          .style('stroke-width', sw);

      var graphNameElementValue: any = select("#graphName").property("value");
      if (graphNameElementValue) {
        graphName = graphNameElementValue;
      } else {
        graphName = "example";
        select("#graphName").attr("value", graphName);
      }
      if ( !localStorage.getItem( getLocalStorageGraphName() ) )
      {
          graphModel = new Model();
          newNode = graphModel.createNode();
          newNode.x = svgElement.clientWidth / 2;
          newNode.y = svgElement.clientHeight / 2;
          save( formatMarkup() );
      } else {
          graphModel = parseMarkup( localStorage.getItem( getLocalStorageGraphName() ) );
      }

      draw();
    }

    var resetGraph = function()
    {
      graphModel = new Model();
      newNode = graphModel.createNode();
      var svgElement = document.getElementById('svgElement')
      newNode.x = svgElement.clientWidth / 2;
      newNode.y = svgElement.clientHeight / 2;
      save( formatMarkup() );
      draw();
    }

    var toggleBubbles = function()
    {
      diagram.toggleRenderPropertyBubblesFlag();
      draw();
    }

    function parseMarkup( markup: any )
    {
        var container: any = select( "body" ).append( "div" );
        container.node().innerHTML = markup;
        var model = Markup.parse( container.select("ul.graph-diagram-markup"), null );
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

    select("#downloadSvgButton").on( "click", (() => {
        let graphEditorStyleSheet = document.getElementById('graph-editor-style');
        let styleData = graphEditorStyleSheet.innerHTML;

        let svg: any = select("#svgContainer svg");
        let firstg: any = svg.select("g")
            .attr("id", "firstg");
        let style = svg.select("#firststyle")
        if (style.empty()) {
            style = svg.insert("style", "#firstg")
                .attr("id", "firststyle");
        }
        style.html(styleData);

        let xml: any = select("#svgContainer svg").node();
        let rawSvg: any = new XMLSerializer().serializeToString(xml);
        select("#downloadSvgButton").attr('href', "data:image/svg+xml;base64," + btoa( rawSvg ));
    }));


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

    var editStyle = function()
    {
        appendModalBackdrop();
        var graphEditorStyleSheet = document.getElementById('graph-editor-style');
        var styleData = graphEditorStyleSheet.innerHTML;
        var temp: any = select( "textarea.code-edit-style" ).node();
        temp.value = styleData
        select( ".modal.edit-style" ).classed( "hide", false );
    };

    select("#saveStyle" ).on("click", function() {
        var temp: any = select( "textarea.code-edit-style" ).node();
        var graphEditorStyleSheet = document.getElementById('graph-editor-style');
        graphEditorStyleSheet.innerHTML = temp.value;
        cancelModal();
    });

    select("#resetStyle" ).on("click", function() {
        var temp: any = select( "textarea.code-edit-style" ).node();
        temp.value = `
body {
    background-color: lightgrey;
}

circle.node-base {
  fill
}

text.caption {
  fill: #FFFFFF;
}

circle.node.overlay:hover {
    fill: rgba(150, 150, 255, 0.5);
}

circle.node.ring:hover {
    stroke: rgba(150, 150, 255, 0.5);
}

path.relationship.overlay:hover {
    fill: rgba(150, 150, 255, 0.5);
    stroke: rgba(150, 150, 255, 0.5);
}
        `;
        var graphEditorStyleSheet = document.getElementById('graph-editor-style');
        graphEditorStyleSheet.innerHTML = temp.value;
        cancelModal();
    });

    function confirmResetGraph() {
        appendModalBackdrop();
        select( ".modal.confirm-reset-graph" ).classed( "hide", false );
    }

    select("#confirmResetGraph").on("click", function() {
        resetGraph();
        cancelModal();
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
    select( "#editStyleButton" ).on( "click", editStyle );
    select( "#load" ).on( "click", loadGraph );
    select( "#resetGraph").on("click", confirmResetGraph);
    select( "#toggleBubbles" ).on( "click", toggleBubbles );

    selectAll( ".modal-dialog" ).on( "click", function ()
    {
        event.stopPropagation();
    } );

    var graphDatalist = select("#graphlist");
    graphDatalist.selectAll("option")
        .data(getGraphList)
        .enter()
        .append("option")
        .attr("value", function(d) { return d; })

    draw();

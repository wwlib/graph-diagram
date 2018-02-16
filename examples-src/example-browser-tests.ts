console.log(`graph-diagram: Typescript Browser Tests:`);

import * as d3 from 'd3';

import {
  GraphDiagram,
  Diagram,
  Markup,
  Model,
  Node,
  SimpleStyle
} from '../src/index';

function compareSvg( expected: any, actual: any, report: any )
{
    if ( expected.tagName != actual.tagName )
    {
        report( expected, actual, "Expected <" + expected.tagName + "> got <" + actual.tagName + ">" );
        return;
    }
    if ( expected.childElementCount != actual.childElementCount )
    {
        report( expected, actual, "different number of children" );
        return;
    }

    for ( var iAttribute = 0; iAttribute < expected.attributes.length; iAttribute++ )
    {
        var expectedAttribute = expected.attributes[iAttribute];
        var name = expectedAttribute.name;
        if (name != "xmlns")
        {
            var actualAttribute = actual.attributes[name];
            if (actualAttribute == null) {
                report(expected, actual, "missing attribute " + name );
                //result = false;
            } else {
                var expectedAttributeValue = expectedAttribute.value;
                var actualAttributeValue = actualAttribute.value;
                if ( expectedAttributeValue != actualAttributeValue )
                {
                    report(expected, actual,
                        "Expected " + name + "=\"" + expectedAttributeValue + "\" but got " + name + "=\"" + actualAttributeValue );
                }
            }
        }
    }

    function onlyElements( nodes: any )
    {
        var elements = [];
        for ( var i = 0; i < nodes.length; i++ )
        {
            var node = nodes[i];
            if ( node.nodeType === 1 )
            {
                elements.push( node );
            }
        }
        return elements;
    }

    var expectedChildElements = onlyElements( expected.childNodes );
    var actualChildElements = onlyElements( actual.childNodes );

    if (expectedChildElements.length === 0) {
        if (expected.textContent.trim() != actual.textContent.trim()) {
            report(expected, actual,
                "Expected text content \"" + expected.textContent + "\" but got \"" + actual.textContent + "\"");
        }
    } else {
        for ( var iChild = 0; iChild < expectedChildElements.length; iChild++ )
        {
            compareSvg( expectedChildElements[iChild], actualChildElements[iChild], report );
        }
    }
}

var allPass = true;
var diagram = new Diagram(); //gd.diagram();
// console.log(diagram);

d3.selectAll( ".example" ).each( function ()
{
    // console.log(this);
    var exampleRow = d3.select( this );

    // console.log(exampleRow);
    var temp = exampleRow.insert( "td", "td" )
        .append( "pre" ).append( "code" )
        .attr( "class", "pretty-markup" )
        .text( function ()
        {
            var markup: any = exampleRow.select( "td.markup" );
            return markup.node().innerHTML.replace(/^      /gm,"").replace(/^\s*\n/g,"").replace(/\n\s*$/,"");
        } );

    var view = exampleRow.append( "td" ).attr( "class", "actual-diagram" ).append( "svg:svg" );
    // console.log(view);

    var exampleRowSelection = exampleRow.select( "ul.graph-diagram-markup");
    // console.log(exampleRowSelection);
    var models = Markup.parseAll( exampleRowSelection );

    // var modelsDebug: any[] = models.map( function ( model ) {
    //     return model.summary();
    // });
    // console.log(`modelsDebug: `, modelsDebug);
    // debugger;

    view
        .data(models)
        .call(diagram.render);

    var errorContainer = exampleRow.selectAll( "td.errors" ).data( [ {} ] );
    errorContainer.enter().append( "td" ).attr( "class", "errors" );

    var resultCell = exampleRow.selectAll( "td.result" ).data( [ {} ] );
    resultCell.enter().append( "td" ).attr( "class", "result" ).append( "i" ).attr( "class", "icon-white" );

    var pass = true;

    compareSvg( exampleRow.select( "td.expected-diagram svg" ).node(), exampleRow.select( "td.actual-diagram svg" ).node(),
            function ( expected: any, actual: any, message: string )
            {
                pass = false;
                errorContainer.append( "li" ).text( message );
            } );

    exampleRow.classed(pass ? "pass" : "fail", true);

    allPass = allPass && pass;
});


// d3.selectAll( ".example.pass .result i" ).classed( "icon-ok", true );
// d3.selectAll( ".example.fail .result i" ).classed( "icon-remove", true );
//
// d3.select( ".overall-result.pass" ).classed( "hide", !allPass );
// d3.select( ".overall-result.fail" ).classed( "hide", allPass );
//
// d3.select( ".examples.table" ).classed( "all-pass", allPass );

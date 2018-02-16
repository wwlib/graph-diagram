import * as d3 from 'd3';
import Diagram from '../diagram/Diagram';
import Markup from '../markup/Markup';

export default class Figure {

    public diagram: Diagram;
    
    constructor(selection: any) {
        this.diagram = new Diagram();
        selection.each( function ()
        {
            var figure = d3.select( this );
            var markup = figure.select( "ul.graph-diagram-markup" );
            var model = Markup.parse( markup );
            figure.selectAll( "svg" )
                .data( [model] )
                .enter()
                .append( "svg" )
                .call( this.diagram.render );
        } );
    }

    scaling(scalingFunction: any): Figure
    {
        this.diagram.scaling(scalingFunction);
        return this;
    }
}

import GraphDiagram from '../GraphDiagram';
import Node from '../model/Node';
import LayoutEntity from '../layout/LayoutEntity';
import NodeSpeechBubble from '../bubble/NodeSpeechBubble';
import Radius from '../bubble/Radius';

export default class LayoutNode extends LayoutEntity {

    public class: any; //string[];
    public x: number;
    public y: number;
    public radius: Radius;
    public captionLines: string[];
    public captionLineHeight: number;

    constructor(graphNode: Node) {
        super(graphNode);
        this.class = graphNode.class;
        this.x = graphNode.ex();
        this.y = graphNode.ey();
        let captionMeasurements = this.wrapAndMeasureCaption(graphNode);
        this.radius = captionMeasurements.radius;
        this.captionLines = captionMeasurements.captionLines;
        this.captionLineHeight = captionMeasurements.captionLineHeight;
        this.propertiesBubble = new NodeSpeechBubble( graphNode, captionMeasurements.radius );
    }

    wrapAndMeasureCaption(node: Node) {
        // function measure( text: string )
        // {
        //     return GraphDiagram.measureTextDimensions( text, node );
        // }

        // console.log(node, node.style(), node.style("font-size"));
        var lineHeight: number = GraphDiagram.parsePixels( node.style( "font-size" ) );
        // console.log(lineHeight);
        var insideRadius: number = 0;
        var captionLines: string[] = [];

        if ( node.displayCaption ) {
            var padding: number = GraphDiagram.parsePixels( node.style( "padding" ) );
            var fontSize: string = node.properties.style( "font-size" );
            var fontFamily: string = node.properties.style( "font-family" );
            var totalWidth: number = GraphDiagram.measureTextDimensions( node.displayCaption, fontSize, fontFamily );
            var idealRadius: number = Math.sqrt( totalWidth * lineHeight / Math.PI );
            var idealRows: number = idealRadius * 2 / lineHeight;
            function idealLength( row: number )
            {
                var rowOffset: number = lineHeight * (row - idealRows) / 2;
                return Math.sqrt( idealRadius * idealRadius - rowOffset * rowOffset) * 2;
            }
            var words: string[] = node.displayCaption.split(" ");
            var currentLine: string = words.shift();
            while (words.length > 0)
            {
                if ( GraphDiagram.measureTextDimensions( currentLine, fontSize, fontFamily ) > idealLength(captionLines.length) )
                {
                    captionLines.push(currentLine);
                    currentLine = words.shift();
                } else {
                    currentLine += " " + words.shift();
                }
            }
            captionLines.push(currentLine);

            for ( var row = 0; row < captionLines.length; row++ )
            {
                var width: number = GraphDiagram.measureTextDimensions( captionLines[row], fontSize, fontFamily ) / 2;
                var middleRow: number = (captionLines.length - 1) / 2;
                var rowOffset: number = lineHeight * (row > middleRow ? (row - middleRow + 0.5) : (row - middleRow - 0.5));
                insideRadius = padding + Math.max( Math.sqrt(width * width + rowOffset * rowOffset), insideRadius);
            }
        }
        let minWidthProperty: string = node.style("min-width") ? node.style("min-width") : "30px";
        var minRadius: number = GraphDiagram.parsePixels( minWidthProperty ) / 2;
        if ( minRadius > insideRadius )
        {
            insideRadius = minRadius;
        }
        var radius: Radius = new Radius(node.model, insideRadius);
        radius.border = GraphDiagram.parsePixels( node.style( "border-width" ) );
        radius.margin = GraphDiagram.parsePixels( node.style( "margin" ) );

        return {
            radius: radius,
            captionLines: captionLines,
            captionLineHeight: lineHeight
        };
    }

}

import * as d3 from 'd3';
import Model from './model/Model';
import Node from './model/Node';
import Radius from './bubble/Radius';
import LayoutNode from './layout/LayoutNode';
import LayoutRelationship from './layout/LayoutRelationship';

export default class GraphDiagram {

    public static  MODEL_ID_KEY: string = 'GRAPH-ID';

    static parsePixels(fontSize: string): number
    {
        let result: number = 0;
        if (fontSize) {
            result = parseFloat( fontSize.slice( 0, -2 ) );
        } else {
            // console.log(`parsePixels: `, fontSize);
        }
        return result;
    }

    static measureTextDimensions( text: string, fontSize: string, fontFamily: string ) {

        var fontSize = fontSize;
        var fontFamily = fontFamily;
        var canvasSelection = d3.select("#textMeasuringCanvas").data([this]);
        canvasSelection.enter().append("canvas")
            .attr("id", "textMeasuringCanvas");

        var canvas: any = document.getElementById('textMeasuringCanvas'); //canvasSelection.node(); //HTMLCanvasElement

        var context = canvas.getContext("2d");
        context.font = "normal normal normal " + fontSize + "/normal " + fontFamily;
        return context.measureText(text).width;
    }

    static hasProperties( entity: LayoutNode | LayoutRelationship ) {
        return entity.model.properties.list({exclude: [GraphDiagram.MODEL_ID_KEY]}).length > 0;
    }
}

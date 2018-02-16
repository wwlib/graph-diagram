import GraphDiagram from '../GraphDiagram';
import LayoutModel from '../layout/LayoutModel';
import LayoutNode from '../layout/LayoutNode';
import LayoutRelationship from '../layout/LayoutNode';
import Node from '../model/Node';

export type Point = {
    x: number;
    y: number;
}

export type BoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type Bounds = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

// export type ViewDimensions = {
//     width: number;
//     height: number;
// }

export default class Scaling {

    static nodeBox( node: LayoutNode )
    {
        var margin = node.radius.outside();
        let graphNode: Node = node.model as Node;
        return {
            x1: graphNode.ex() - margin,
            y1: graphNode.ey() - margin,
            x2: graphNode.ex() + margin,
            y2: graphNode.ey() + margin
        };
    };

    static boxNormalise( box: BoundingBox ): Bounds
    {
        return {
            x1: box.width > 0 ? box.x : box.x + box.width,
            y1: box.height > 0 ? box.y : box.y +box. height,
            x2: box.width < 0 ? box.x : box.x + box.width,
            y2: box.height < 0 ? box.y : box.y + box.height
        };
    };

    static boxUnion( boxes: Bounds[] ): Bounds
    {
        if ( boxes.length < 1 )
        {
            return { x1:0, y1:0, x2:0, y2:0 };
        }
        return boxes.reduce( function ( previous: Bounds, current: Bounds)
        {
            return {
                x1:Math.min( previous.x1, current.x1 ),
                y1:Math.min( previous.y1, current.y1 ),
                x2:Math.max( previous.x2, current.x2 ),
                y2:Math.max( previous.y2, current.y2 )
            };
        } );
    };

    static smallestContainingBox(layoutModel: LayoutModel): BoundingBox {
        function boundingBox( entity: LayoutNode | LayoutRelationship )
        {
            return entity.propertiesBubble.boundingBox;
        }

        var bounds = Scaling.boxUnion( layoutModel.nodes.map( Scaling.nodeBox )
            .concat( layoutModel.nodes.filter(GraphDiagram.hasProperties ).map( boundingBox )
                .map( Scaling.boxNormalise ) )
            .concat( layoutModel.relationships.filter(GraphDiagram.hasProperties ).map( boundingBox )
                .map( Scaling.boxNormalise ) ) );

        return { x: bounds.x1, y: bounds.y1,
            width: (bounds.x2 - bounds.x1), height: (bounds.y2 - bounds.y1) }
    }

    static centeredOrScaledViewBox(viewDimensions: BoundingBox, diagramExtent: BoundingBox): BoundingBox {
        var xScale = diagramExtent.width / viewDimensions.width;
        var yScale = diagramExtent.height / viewDimensions.height;
        var scaleFactor = xScale < 1 && yScale < 1 ? 1 : (xScale > yScale ? xScale : yScale);

        return {
            x: ((diagramExtent.width - viewDimensions.width * scaleFactor) / 2) + diagramExtent.x,
            y: ((diagramExtent.height - viewDimensions.height * scaleFactor) / 2) + diagramExtent.y,
            width: viewDimensions.width * scaleFactor,
            height: viewDimensions.height * scaleFactor
        };
    };

    static effectiveBox( viewBox: BoundingBox, viewSize: BoundingBox )
    {
        if ( viewBox.width / viewSize.width > viewBox.height / viewSize.height )
        {
            return {
                x: viewBox.x,
                y: viewBox.y - ((viewBox.width * viewSize.height / viewSize.width) - viewBox.height) / 2,
                width: viewBox.width,
                height: viewBox.width * viewSize.height / viewSize.width
            }
        }
        else
        {
            return {
                x: viewBox.x - ((viewBox.height * viewSize.width / viewSize.height) - viewBox.width) / 2,
                y: viewBox.y,
                width: viewBox.height * viewSize.width / viewSize.height,
                height: viewBox.height
            }
        }
    }

    static viewDimensions(view: any): BoundingBox
    {
        var svgElement = view.node();
        return {
            x: 0,
            y: 0,
            width: svgElement.clientWidth,
            height: svgElement.clientHeight
        };
    }

    static centerOrScaleDiagramToFitSvg(layoutModel: LayoutModel, view: any) {
        var box = Scaling.centeredOrScaledViewBox( Scaling.viewDimensions(view), Scaling.smallestContainingBox( layoutModel ) );

        view
            .attr("viewBox", [box.x, box.y, box.width, box.height].join( " " ));
    };

    static centerOrScaleDiagramToFitWindow(layoutModel: LayoutModel, view: any) {
        var windowDimensions = {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
        var box = Scaling.centeredOrScaledViewBox( windowDimensions, Scaling.smallestContainingBox( layoutModel ) );

        view
            .attr("width", windowDimensions.width)
            .attr("height", windowDimensions.height)
            .attr("viewBox", [box.x, box.y, box.width, box.height].join( " " ));
    };

    static centerOrScaleDiagramToFitSvgSmooth(layoutModel: LayoutModel, view: any) {
        var box = Scaling.centeredOrScaledViewBox( Scaling.viewDimensions(view), Scaling.smallestContainingBox( layoutModel ) );

        view
            .transition()
            .attr("viewBox", [box.x, box.y, box.width, box.height].join( " " ));
    };

    static fitsInside( extent: BoundingBox, box: BoundingBox )
    {
        return extent.x >= box.x &&
            extent.y >= box.y &&
            extent.x + extent.width <= box.x + box.width &&
            extent.y + extent.height <= box.y + box.height;
    }

    static growButDoNotShrink(layoutModel: LayoutModel, view: any) {
        var currentViewBoxAttr = view.attr("viewBox");
        if ( currentViewBoxAttr === null )
        {
            // Scaling.centeredOrScaledViewBox(layoutModel, view); //FUNKY //TODO
        } else {
            var currentDimensions = currentViewBoxAttr.split(" " ).map(parseFloat);
            var currentBox = {
                x: currentDimensions[0],
                y: currentDimensions[1],
                width: currentDimensions[2],
                height: currentDimensions[3]
            };
            var diagramExtent = Scaling.smallestContainingBox( layoutModel );

            var box;
            if ( Scaling.fitsInside(diagramExtent, Scaling.effectiveBox( currentBox, Scaling.viewDimensions( view ) ))) {
                box = currentBox;
            }
            else
            {
                var idealBox = Scaling.centeredOrScaledViewBox( Scaling.viewDimensions(view), diagramExtent );
                box = {
                    x: Math.min(currentBox.x, idealBox.x),
                    y: Math.min(currentBox.y, idealBox.y),
                    width: Math.max(currentBox.x + currentBox.width, idealBox.x + idealBox.width) -
                        Math.min(currentBox.x, idealBox.x),
                    height: Math.max(currentBox.y + currentBox.height, idealBox.y + idealBox.height) -
                        Math.min(currentBox.y, idealBox.y)
                };
            }

            view
                .attr("viewBox", [box.x, box.y, box.width, box.height].join( " " ));
        }
    };

    static sizeSvgToFitDiagram(layoutModel: LayoutModel, view: any) {
        var box = Scaling.smallestContainingBox( layoutModel );

        view
            .attr("viewBox", [box.x, box.y, box.width, box.height].join( " " ))
            .attr("width", box.width * layoutModel.graphModel.externalScale)
            .attr("height", box.height * layoutModel.graphModel.externalScale);
    };

}

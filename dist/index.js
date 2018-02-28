(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"));
	else if(typeof define === 'function' && define.amd)
		define("graphDiagram", ["d3"], factory);
	else if(typeof exports === 'object')
		exports["graphDiagram"] = factory(require("d3"));
	else
		root["graphDiagram"] = factory(root["d3"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __webpack_require__(1);
class GraphDiagram {
    static parsePixels(fontSize) {
        let result = 0;
        if (fontSize) {
            result = parseFloat(fontSize.slice(0, -2));
        }
        else {
            // console.log(`parsePixels: `, fontSize);
        }
        return result;
    }
    static measureTextDimensions(text, fontSize, fontFamily) {
        var fontSize = fontSize;
        var fontFamily = fontFamily;
        var canvasSelection = d3.select("#textMeasuringCanvas").data([this]);
        canvasSelection.enter().append("canvas")
            .attr("id", "textMeasuringCanvas");
        var canvas = document.getElementById('textMeasuringCanvas'); //canvasSelection.node(); //HTMLCanvasElement
        var context = canvas.getContext("2d");
        context.font = "normal normal normal " + fontSize + "/normal " + fontFamily;
        return context.measureText(text).width;
    }
    static hasProperties(entity) {
        return entity.model.properties.list({ exclude: [GraphDiagram.MODEL_ID_KEY] }).length > 0;
    }
}
GraphDiagram.MODEL_ID_KEY = 'MODEL_ID';
exports.default = GraphDiagram;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class SimpleStyle {
    constructor(stylePrototype) {
        this._styles = {};
        if (stylePrototype && (stylePrototype instanceof SimpleStyle)) {
            let styleMap = stylePrototype.style();
            // console.log(`styleMap:`, styleMap);
            for (let key in styleMap) {
                if (styleMap.hasOwnProperty(key)) {
                    this._styles[key] = styleMap[key];
                }
            }
        }
        else {
            let styleMap = stylePrototype;
            // console.log(`styleMap:`, styleMap);
            for (let key in styleMap) {
                this._styles[key] = styleMap[key];
            }
        }
    }
    style(cssPropertyKey, cssPropertyValue) {
        // console.log(`SimpleStyle: style: ${cssPropertyKey}, ${cssPropertyValue}`, arguments, this);
        if (cssPropertyKey && cssPropertyValue) {
            this._styles[cssPropertyKey] = cssPropertyValue;
            return this;
        }
        else if (cssPropertyKey) {
            return this._styles[cssPropertyKey];
        }
        else {
            return this._styles;
        }
    }
    static copyStyle(entity, computedStyle, cssPropertyKey, backupCssPropertyKey, debug = false) {
        var propertyValue = computedStyle.getPropertyValue(cssPropertyKey);
        if (!propertyValue) {
            propertyValue = computedStyle.getPropertyValue(backupCssPropertyKey);
        }
        if (debug) {
            console.log(`  ${cssPropertyKey}: ${propertyValue}`);
        }
        entity.style(cssPropertyKey, propertyValue);
    }
    static copyStyles(entity, markup, debug = false) {
        var computedStyle = window.getComputedStyle(markup.node());
        if (debug) {
            console.log(`copyStyles from: `, markup.node());
        }
        SimpleStyle.copyStyle(entity, computedStyle, "width", "width", debug);
        SimpleStyle.copyStyle(entity, computedStyle, "min-width", "min-width", debug);
        SimpleStyle.copyStyle(entity, computedStyle, "font-family", "font-family", debug);
        SimpleStyle.copyStyle(entity, computedStyle, "font-size", "font-size", debug);
        SimpleStyle.copyStyle(entity, computedStyle, "margin", "margin-top", debug);
        SimpleStyle.copyStyle(entity, computedStyle, "padding", "padding-top", debug);
        SimpleStyle.copyStyle(entity, computedStyle, "color", "color", debug);
        SimpleStyle.copyStyle(entity, computedStyle, "background-color", "background-color", debug);
        SimpleStyle.copyStyle(entity, computedStyle, "border-width", "border-top-width", debug);
        SimpleStyle.copyStyle(entity, computedStyle, "border-style", "border-top-style", debug);
        SimpleStyle.copyStyle(entity, computedStyle, "border-color", "border-top-color", debug);
    }
}
exports.default = SimpleStyle;
// export default class SimpleStyle {
//     private _style: any;
//
//     constructor(stylePrototype?: any) {
//         this._style = this.styleSet(stylePrototype);
//     }
//
//     get style(): any {
//         return this._style;
//     }
//
//     styleSet(stylePrototype?: any) {
//         var styles = {};
//
//         if (stylePrototype) {
//             var styleMap = stylePrototype.style();
//             for (var key in styleMap) {
//                 if (styleMap.hasOwnProperty(key)) {
//                     styles[key] = styleMap[key];
//                 }
//             }
//         }
//
//         return function(cssPropertyKey: string, cssPropertyValue: string) {
//             if (arguments.length == 2) {
//                 styles[cssPropertyKey] = cssPropertyValue;
//                 return this;
//             }
//             if (arguments.length == 1) {
//                 return styles[cssPropertyKey];
//             }
//             return styles;
//         }
//     }
// }


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GraphDiagram_1 = __webpack_require__(0);
exports.GraphDiagram = GraphDiagram_1.default;
const Diagram_1 = __webpack_require__(17);
exports.Diagram = Diagram_1.default;
const Markup_1 = __webpack_require__(22);
exports.Markup = Markup_1.default;
const Model_1 = __webpack_require__(11);
exports.Model = Model_1.default;
const ModelToCypher_1 = __webpack_require__(23);
exports.ModelToCypher = ModelToCypher_1.default;
const ModelToD3_1 = __webpack_require__(24);
exports.ModelToD3 = ModelToD3_1.default;
const Node_1 = __webpack_require__(12);
exports.Node = Node_1.default;
const SimpleStyle_1 = __webpack_require__(2);
exports.SimpleStyle = SimpleStyle_1.default;
const CurvedArrowOutline_1 = __webpack_require__(9);
exports.CurvedArrowOutline = CurvedArrowOutline_1.default;
const Relationship_1 = __webpack_require__(15);
exports.Relationship = Relationship_1.default;
const Scaling_1 = __webpack_require__(10);
exports.Scaling = Scaling_1.default;
const Layout_1 = __webpack_require__(4);
exports.Layout = Layout_1.default;
const LayoutModel_1 = __webpack_require__(25);
exports.LayoutModel = LayoutModel_1.default;
const LayoutNode_1 = __webpack_require__(8);
exports.LayoutNode = LayoutNode_1.default;
const LayoutRelationship_1 = __webpack_require__(5);
exports.LayoutRelationship = LayoutRelationship_1.default;
const DataTypes_1 = __webpack_require__(16);
exports.DataTypes = DataTypes_1.DataTypes;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GraphDiagram_1 = __webpack_require__(0);
//import NodeSpeechBubble from '../bubble/NodeSpeechBubble';
//import RelationshipSpeechBubble from '../bubble/RelationshipSpeechBubble';
const LayoutRelationship_1 = __webpack_require__(5);
const LayoutNode_1 = __webpack_require__(8);
const HorizontalArrowOutline_1 = __webpack_require__(21);
const CurvedArrowOutline_1 = __webpack_require__(9);
class Layout {
    constructor(graphModel) {
        this.nodesById = new Map();
        this.layoutModel = {
            graphModel: graphModel,
            nodes: [],
            relationships: [],
            relationshipGroups: []
        };
        graphModel.nodeList().forEach((node) => {
            // var measurement: any = Layout.wrapAndMeasureCaption( node ); //FUNKY //TODO
            var layoutNode = new LayoutNode_1.default(node);
            this.nodesById.set(node.id, layoutNode);
            this.layoutModel.nodes.push(layoutNode);
        });
        graphModel.groupedRelationshipList().forEach((group) => {
            var nominatedStart = group[0].start;
            var offsetStep = GraphDiagram_1.default.parsePixels(group[0].style("margin"));
            var relationshipGroup = [];
            for (var i = 0; i < group.length; i++) {
                var relationship = group[i];
                var offset = (relationship.start === nominatedStart ? 1 : -1) *
                    offsetStep * (i - (group.length - 1) / 2);
                // console.log(`groupedRelationshipList: offset: ${offset}`);
                var start = this.nodesById.get(relationship.start.id);
                var end = this.nodesById.get(relationship.end.id);
                var arrow = this.horizontalArrow(relationship, start, end, offset);
                var layoutRelationship = new LayoutRelationship_1.default(relationship, start, end, arrow);
                relationshipGroup.push(layoutRelationship);
                this.layoutModel.relationships.push(layoutRelationship);
            }
            this.layoutModel.relationshipGroups.push(relationshipGroup);
        });
    }
    horizontalArrow(relationship, start, end, offset) {
        var length = start.model.distanceTo(end.model);
        var arrowWidth = GraphDiagram_1.default.parsePixels(relationship.style("width"));
        if (offset === 0) {
            return new HorizontalArrowOutline_1.default(start.radius.startRelationship(), (length - end.radius.endRelationship()), arrowWidth);
        }
        return new CurvedArrowOutline_1.default(start.radius.startRelationship(), end.radius.endRelationship(), length, offset, arrowWidth, arrowWidth * 4, arrowWidth * 4);
    }
}
exports.default = Layout;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const LayoutEntity_1 = __webpack_require__(6);
const RelationshipSpeechBubble_1 = __webpack_require__(18);
class LayoutRelationship extends LayoutEntity_1.default {
    constructor(graphRelationship, start, end, arrow) {
        super(graphRelationship);
        this.start = start;
        this.end = end;
        this.arrow = arrow;
        this.propertiesBubble = new RelationshipSpeechBubble_1.default(graphRelationship, arrow.apex);
        this.model = graphRelationship;
    }
}
exports.default = LayoutRelationship;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class LayoutEntity {
    constructor(entity) {
        this.model = entity;
        this.propertiesBubble = {};
    }
}
exports.default = LayoutEntity;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Bubble {
    constructor(entity) {
        this.entity = entity;
    }
}
Bubble.speechBubblePath = function (textSize, style, margin, padding) {
    var width = textSize.width, height = textSize.height;
    var styles = {
        diagonal: [
            "M", 0, 0,
            "L", margin + padding, margin,
            "L", margin + width + padding, margin,
            "A", padding, padding, 0, 0, 1, margin + width + padding * 2, margin + padding,
            "L", margin + width + padding * 2, margin + height + padding,
            "A", padding, padding, 0, 0, 1, margin + width + padding, margin + height + padding * 2,
            "L", margin + padding, margin + height + padding * 2,
            "A", padding, padding, 0, 0, 1, margin, margin + height + padding,
            "L", margin, margin + padding,
            "Z"
        ],
        horizontal: [
            "M", 0, 0,
            "L", margin, -padding,
            "L", margin, -height / 2,
            "A", padding, padding, 0, 0, 1, margin + padding, -height / 2 - padding,
            "L", margin + width + padding, -height / 2 - padding,
            "A", padding, padding, 0, 0, 1, margin + width + padding * 2, -height / 2,
            "L", margin + width + padding * 2, height / 2,
            "A", padding, padding, 0, 0, 1, margin + width + padding, height / 2 + padding,
            "L", margin + padding, height / 2 + padding,
            "A", padding, padding, 0, 0, 1, margin, height / 2,
            "L", margin, padding,
            "Z"
        ],
        vertical: [
            "M", 0, 0,
            "L", -padding, margin,
            "L", -width / 2, margin,
            "A", padding, padding, 0, 0, 0, -width / 2 - padding, margin + padding,
            "L", -width / 2 - padding, margin + height + padding,
            "A", padding, padding, 0, 0, 0, -width / 2, margin + height + padding * 2,
            "L", width / 2, margin + height + padding * 2,
            "A", padding, padding, 0, 0, 0, width / 2 + padding, margin + height + padding,
            "L", width / 2 + padding, margin + padding,
            "A", padding, padding, 0, 0, 0, width / 2, margin,
            "L", padding, margin,
            "Z"
        ]
    };
    return styles[style].join(" ");
};
exports.default = Bubble;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GraphDiagram_1 = __webpack_require__(0);
const LayoutEntity_1 = __webpack_require__(6);
const NodeSpeechBubble_1 = __webpack_require__(19);
const Radius_1 = __webpack_require__(20);
class LayoutNode extends LayoutEntity_1.default {
    constructor(graphNode) {
        super(graphNode);
        this.class = graphNode.class;
        this.x = graphNode.ex();
        this.y = graphNode.ey();
        let captionMeasurements = this.wrapAndMeasureCaption(graphNode);
        this.radius = captionMeasurements.radius;
        this.captionLines = captionMeasurements.captionLines;
        this.captionLineHeight = captionMeasurements.captionLineHeight;
        this.propertiesBubble = new NodeSpeechBubble_1.default(graphNode, captionMeasurements.radius);
    }
    wrapAndMeasureCaption(node) {
        // function measure( text: string )
        // {
        //     return GraphDiagram.measureTextDimensions( text, node );
        // }
        // console.log(node, node.style(), node.style("font-size"));
        var lineHeight = GraphDiagram_1.default.parsePixels(node.style("font-size"));
        // console.log(lineHeight);
        var insideRadius = 0;
        var captionLines = [];
        if (node.displayCaption) {
            var padding = GraphDiagram_1.default.parsePixels(node.style("padding"));
            var fontSize = node.properties.style("font-size");
            var fontFamily = node.properties.style("font-family");
            var totalWidth = GraphDiagram_1.default.measureTextDimensions(node.displayCaption, fontSize, fontFamily);
            var idealRadius = Math.sqrt(totalWidth * lineHeight / Math.PI);
            var idealRows = idealRadius * 2 / lineHeight;
            function idealLength(row) {
                var rowOffset = lineHeight * (row - idealRows) / 2;
                return Math.sqrt(idealRadius * idealRadius - rowOffset * rowOffset) * 2;
            }
            var words = node.displayCaption.split(" ");
            var currentLine = words.shift();
            while (words.length > 0) {
                if (GraphDiagram_1.default.measureTextDimensions(currentLine, fontSize, fontFamily) > idealLength(captionLines.length)) {
                    captionLines.push(currentLine);
                    currentLine = words.shift();
                }
                else {
                    currentLine += " " + words.shift();
                }
            }
            captionLines.push(currentLine);
            for (var row = 0; row < captionLines.length; row++) {
                var width = GraphDiagram_1.default.measureTextDimensions(captionLines[row], fontSize, fontFamily) / 2;
                var middleRow = (captionLines.length - 1) / 2;
                var rowOffset = lineHeight * (row > middleRow ? (row - middleRow + 0.5) : (row - middleRow - 0.5));
                insideRadius = padding + Math.max(Math.sqrt(width * width + rowOffset * rowOffset), insideRadius);
            }
        }
        let minWidthProperty = node.style("min-width") ? node.style("min-width") : "30px";
        var minRadius = GraphDiagram_1.default.parsePixels(minWidthProperty) / 2;
        if (minRadius > insideRadius) {
            insideRadius = minRadius;
        }
        var radius = new Radius_1.default(node.model, insideRadius);
        radius.border = GraphDiagram_1.default.parsePixels(node.style("border-width"));
        radius.margin = GraphDiagram_1.default.parsePixels(node.style("margin"));
        return {
            radius: radius,
            captionLines: captionLines,
            captionLineHeight: lineHeight
        };
    }
}
exports.default = LayoutNode;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class CurvedArrowOutline {
    constructor(startRadius, endRadius, endCentre, minOffset, arrowWidth, headWidth, headLength) {
        this.startRadius = startRadius;
        this.endRadius = endRadius;
        this.endCentre = endCentre;
        this.minOffset = minOffset;
        this.arrowWidth = arrowWidth;
        this.headWidth = headWidth;
        this.headLength = headLength;
        this.radiusRatio = startRadius / (endRadius + headLength);
        this.homotheticCenter = -endCentre * this.radiusRatio / (1 - this.radiusRatio);
        if (endRadius + headLength > startRadius) {
            this.offsetAngle = minOffset / startRadius;
            this.startAttach = {
                x: Math.cos(this.offsetAngle) * (startRadius),
                y: Math.sin(this.offsetAngle) * (startRadius)
            };
            this.endAttach = this.intersectWithOtherCircle(this.startAttach, endRadius + headLength, endCentre, -1);
        }
        else {
            this.offsetAngle = minOffset / endRadius;
            this.endAttach = {
                x: endCentre - Math.cos(this.offsetAngle) * (endRadius + headLength),
                y: Math.sin(this.offsetAngle) * (endRadius + headLength)
            };
            this.startAttach = this.intersectWithOtherCircle(this.endAttach, startRadius, 0, 1);
        }
        this.g1 = -this.startAttach.x / this.startAttach.y,
            this.c1 = this.startAttach.y + (this.square(this.startAttach.x) / this.startAttach.y),
            this.g2 = -(this.endAttach.x - this.endCentre) / this.endAttach.y,
            this.c2 = this.endAttach.y + (this.endAttach.x - this.endCentre) * this.endAttach.x / this.endAttach.y;
        this.cx = (this.c1 - this.c2) / (this.g2 - this.g1);
        this.cy = this.g1 * this.cx + this.c1;
        this.arcRadius = Math.sqrt(this.square(this.cx - this.startAttach.x) + this.square(this.cy - this.startAttach.y));
        this.shaftRadius = this.arrowWidth / 2;
        this.headRadius = this.headWidth / 2;
        this.outline = [
            "M", this.startTangent(-this.shaftRadius),
            "L", this.startTangent(this.shaftRadius),
            "A", this.arcRadius - this.shaftRadius, this.arcRadius - this.shaftRadius, 0, 0, minOffset > 0 ? 0 : 1, this.endTangent(-this.shaftRadius),
            "L", this.endTangent(-this.headRadius),
            "L", this.endNormal(headLength),
            "L", this.endTangent(this.headRadius),
            "L", this.endTangent(this.shaftRadius),
            "A", this.arcRadius + this.shaftRadius, this.arcRadius + this.shaftRadius, 0, 0, minOffset < 0 ? 0 : 1, this.startTangent(-this.shaftRadius)
        ].join(" ");
        this.apex = {
            x: this.cx,
            y: this.cy > 0 ? this.cy - this.arcRadius : this.cy + this.arcRadius
        };
    }
    square(l) {
        return l * l;
    }
    intersectWithOtherCircle(fixedPoint, radius, xCenter, polarity) {
        var gradient = fixedPoint.y / (fixedPoint.x - this.homotheticCenter);
        var hc = fixedPoint.y - gradient * fixedPoint.x;
        var A = 1 + this.square(gradient);
        var B = 2 * (gradient * hc - xCenter);
        var C = this.square(hc) + this.square(xCenter) - this.square(radius);
        var intersection = { x: (-B + polarity * Math.sqrt(this.square(B) - 4 * A * C)) / (2 * A) };
        intersection.y = (intersection.x - this.homotheticCenter) * gradient;
        return intersection;
    }
    startTangent(dr) {
        var dx = (dr < 0 ? -1 : 1) * Math.sqrt(this.square(dr) / (1 + this.square(this.g1)));
        var dy = this.g1 * dx;
        return [
            this.startAttach.x + dx,
            this.startAttach.y + dy
        ].join(",");
    }
    endTangent(dr) {
        var dx = (dr < 0 ? -1 : 1) * Math.sqrt(this.square(dr) / (1 + this.square(this.g2)));
        var dy = this.g2 * dx;
        return [
            this.endAttach.x + dx,
            this.endAttach.y + dy
        ].join(",");
    }
    endNormal(dc) {
        var dx = (dc < 0 ? -1 : 1) * Math.sqrt(this.square(dc) / (1 + this.square(1 / this.g2)));
        var dy = dx / this.g2;
        return [
            this.endAttach.x + dx,
            this.endAttach.y - dy
        ].join(",");
    }
}
exports.default = CurvedArrowOutline;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GraphDiagram_1 = __webpack_require__(0);
// export type ViewDimensions = {
//     width: number;
//     height: number;
// }
class Scaling {
    static nodeBox(node) {
        var margin = node.radius.outside();
        let graphNode = node.model;
        return {
            x1: graphNode.ex() - margin,
            y1: graphNode.ey() - margin,
            x2: graphNode.ex() + margin,
            y2: graphNode.ey() + margin
        };
    }
    ;
    static boxNormalise(box) {
        return {
            x1: box.width > 0 ? box.x : box.x + box.width,
            y1: box.height > 0 ? box.y : box.y + box.height,
            x2: box.width < 0 ? box.x : box.x + box.width,
            y2: box.height < 0 ? box.y : box.y + box.height
        };
    }
    ;
    static boxUnion(boxes) {
        if (boxes.length < 1) {
            return { x1: 0, y1: 0, x2: 0, y2: 0 };
        }
        return boxes.reduce(function (previous, current) {
            return {
                x1: Math.min(previous.x1, current.x1),
                y1: Math.min(previous.y1, current.y1),
                x2: Math.max(previous.x2, current.x2),
                y2: Math.max(previous.y2, current.y2)
            };
        });
    }
    ;
    static smallestContainingBox(layoutModel) {
        function boundingBox(entity) {
            return entity.propertiesBubble.boundingBox;
        }
        var bounds = Scaling.boxUnion(layoutModel.nodes.map(Scaling.nodeBox)
            .concat(layoutModel.nodes.filter(GraphDiagram_1.default.hasProperties).map(boundingBox)
            .map(Scaling.boxNormalise))
            .concat(layoutModel.relationships.filter(GraphDiagram_1.default.hasProperties).map(boundingBox)
            .map(Scaling.boxNormalise)));
        return { x: bounds.x1, y: bounds.y1,
            width: (bounds.x2 - bounds.x1), height: (bounds.y2 - bounds.y1) };
    }
    static centeredOrScaledViewBox(viewDimensions, diagramExtent) {
        var xScale = diagramExtent.width / viewDimensions.width;
        var yScale = diagramExtent.height / viewDimensions.height;
        var scaleFactor = xScale < 1 && yScale < 1 ? 1 : (xScale > yScale ? xScale : yScale);
        return {
            x: ((diagramExtent.width - viewDimensions.width * scaleFactor) / 2) + diagramExtent.x,
            y: ((diagramExtent.height - viewDimensions.height * scaleFactor) / 2) + diagramExtent.y,
            width: viewDimensions.width * scaleFactor,
            height: viewDimensions.height * scaleFactor
        };
    }
    ;
    static effectiveBox(viewBox, viewSize) {
        if (viewBox.width / viewSize.width > viewBox.height / viewSize.height) {
            return {
                x: viewBox.x,
                y: viewBox.y - ((viewBox.width * viewSize.height / viewSize.width) - viewBox.height) / 2,
                width: viewBox.width,
                height: viewBox.width * viewSize.height / viewSize.width
            };
        }
        else {
            return {
                x: viewBox.x - ((viewBox.height * viewSize.width / viewSize.height) - viewBox.width) / 2,
                y: viewBox.y,
                width: viewBox.height * viewSize.width / viewSize.height,
                height: viewBox.height
            };
        }
    }
    static viewDimensions(view) {
        var svgElement = view.node();
        return {
            x: 0,
            y: 0,
            width: svgElement.clientWidth,
            height: svgElement.clientHeight
        };
    }
    static centerOrScaleDiagramToFitSvg(layoutModel, view) {
        var box = Scaling.centeredOrScaledViewBox(Scaling.viewDimensions(view), Scaling.smallestContainingBox(layoutModel));
        view
            .attr("viewBox", [box.x, box.y, box.width, box.height].join(" "));
    }
    ;
    static centerOrScaleDiagramToFitWindow(layoutModel, view) {
        var windowDimensions = {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
        var box = Scaling.centeredOrScaledViewBox(windowDimensions, Scaling.smallestContainingBox(layoutModel));
        view
            .attr("width", windowDimensions.width)
            .attr("height", windowDimensions.height)
            .attr("viewBox", [box.x, box.y, box.width, box.height].join(" "));
    }
    ;
    static centerOrScaleDiagramToFitSvgSmooth(layoutModel, view) {
        var box = Scaling.centeredOrScaledViewBox(Scaling.viewDimensions(view), Scaling.smallestContainingBox(layoutModel));
        view
            .transition()
            .attr("viewBox", [box.x, box.y, box.width, box.height].join(" "));
    }
    ;
    static fitsInside(extent, box) {
        return extent.x >= box.x &&
            extent.y >= box.y &&
            extent.x + extent.width <= box.x + box.width &&
            extent.y + extent.height <= box.y + box.height;
    }
    static growButDoNotShrink(layoutModel, view) {
        var currentViewBoxAttr = view.attr("viewBox");
        if (currentViewBoxAttr === null) {
            // Scaling.centeredOrScaledViewBox(layoutModel, view); //FUNKY //TODO
        }
        else {
            var currentDimensions = currentViewBoxAttr.split(" ").map(parseFloat);
            var currentBox = {
                x: currentDimensions[0],
                y: currentDimensions[1],
                width: currentDimensions[2],
                height: currentDimensions[3]
            };
            var diagramExtent = Scaling.smallestContainingBox(layoutModel);
            var box;
            if (Scaling.fitsInside(diagramExtent, Scaling.effectiveBox(currentBox, Scaling.viewDimensions(view)))) {
                box = currentBox;
            }
            else {
                var idealBox = Scaling.centeredOrScaledViewBox(Scaling.viewDimensions(view), diagramExtent);
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
                .attr("viewBox", [box.x, box.y, box.width, box.height].join(" "));
        }
    }
    ;
    static sizeSvgToFitDiagram(layoutModel, view) {
        var box = Scaling.smallestContainingBox(layoutModel);
        view
            .attr("viewBox", [box.x, box.y, box.width, box.height].join(" "))
            .attr("width", box.width * layoutModel.graphModel.externalScale)
            .attr("height", box.height * layoutModel.graphModel.externalScale);
    }
    ;
}
exports.default = Scaling;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SimpleStyle_1 = __webpack_require__(2);
const d3 = __webpack_require__(1);
const Node_1 = __webpack_require__(12);
const Relationship_1 = __webpack_require__(15);
class Model {
    /*
        .graph-diagram-markup {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
    
        .graph-diagram-markup .node {
            font-size: 14px;
            margin: 5px;
            padding: 5px;
            min-width: 30px;
            background-color: #f7f7f9;
            border: 1px solid rgba(0, 0, 0, 0.3);
        }
    
        .graph-diagram-markup .relationship {
            font-size: 14px;
            width: 2px;
            margin: 10px;
            background-color: rgba(0, 0, 0, 0.3);
            border: none;
        }
    
        .graph-diagram-markup .properties {
            font-size: 14px;
            margin: 12px;
            padding: 4px;
            background-color: white;
            border: 1px solid rgba(0, 0, 0, 0.5);
        }
    */
    constructor(id) {
        this.nodes = new Map();
        this.relationships = new Map();
        this.highestNodeIndex = 0;
        this.highestRelationshipIndex = 0;
        this.parameters = {
            radius: 50,
            nodeStrokeWidth: 8,
            nodeStartMargin: 11,
            nodeEndMargin: 11,
            speechBubbleMargin: 20,
            speechBubblePadding: 10,
            speechBubbleStrokeWidth: 3,
            snapTolerance: 20
        };
        this._internalScale = 1;
        this._externalScale = 1;
        if (id) {
            this._id = id;
        }
        this.stylePrototype = {
            node: new SimpleStyle_1.default({
                'min-width': '30px',
                'font-size': '14px',
                'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
                'padding': '5px',
                'border-width': '1px',
                'border-color': 'rgba(0, 0, 0, 0.3)',
                'margin': '5px',
                'background-color': '#f7f7f9',
                'border': '1px solid rgba(0, 0, 0, 0.3)'
            }),
            nodeProperties: new SimpleStyle_1.default({
                'font-size': '14px',
                'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
                'padding': '4px',
                'margin': '12px',
                'background-color': 'white',
                'border': '1px solid rgba(0, 0, 0, 0.5)',
                'border-color': 'rgba(0, 0, 0, 0.5)',
                'border-width': '1px'
            }),
            relationship: new SimpleStyle_1.default({
                'font-size': '14px',
                'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
                'width': '2px',
                'border-width': '3px',
                'margin': '10px',
                'background-color': 'rgba(0, 0, 0, 0.3)',
                'border': 'none'
            }),
            relationshipProperties: new SimpleStyle_1.default({
                'font-size': '14px',
                'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
                'padding': '4px',
                'margin': '12px',
                'background-color': 'white',
                'border': '1px solid rgba(0, 0, 0, 0.5)',
                'border-color': 'rgba(0, 0, 0, 0.5)',
                'border-width': '1px'
            })
        };
    }
    toString() {
        let result = 'Model:\n';
        let obj = {
            highestNodeIndex: this.highestNodeIndex,
            highestRelationshipIndex: this.highestRelationshipIndex,
            nodeCount: this.nodes.size,
            relationshipCount: this.relationships.size,
            nodeStylePrototype: this.stylePrototype.node.style(),
        };
        result += JSON.stringify(obj);
        return result;
    }
    summary() {
        let obj = {
            highestNodeIndex: this.highestNodeIndex,
            highestRelationshipIndex: this.highestRelationshipIndex,
            nodeCount: this.nodes.size,
            relationshipCount: this.relationships.size,
            nodePropertiesStylePrototype: this.stylePrototype.nodeProperties.style(),
            relationshipPropertiesStylePrototype: this.stylePrototype.relationshipProperties.style(),
        };
        return obj;
    }
    generateNodeIndex() {
        while (this.nodes.get(`${this.highestNodeIndex}`)) {
            this.highestNodeIndex++;
        }
        return this.highestNodeIndex;
    }
    createNode(optionalId) {
        var node = new Node_1.default(this);
        node.index = this.generateNodeIndex();
        var nodeId = optionalId || `${node.index}`;
        node.id = nodeId;
        this.nodes.set(nodeId, node);
        return node;
    }
    ;
    deleteNode(node) {
        // this.relationships = this.relationships.filter(function (relationship) {
        //     return !(relationship.start === node || relationship.end == node);
        // });
        this.relationships.forEach((relationship, id, map) => {
            if ((relationship.start === node) || (relationship.end === node)) {
                this.relationships.delete(id);
            }
        });
        this.nodes.delete(node.id);
    }
    ;
    deleteRelationship(relationship) {
        //this.relationships.splice(this.relationships.indexOf(relationship), 1);
        this.relationships.delete(relationship.id);
    }
    ;
    generateRelationshipIndex() {
        while (this.relationships.get(`${this.highestRelationshipIndex}`)) {
            this.highestRelationshipIndex++;
        }
        return this.highestRelationshipIndex++;
    }
    createRelationship(start, end, optionalId) {
        var relationship = new Relationship_1.default(this, start, end);
        relationship.index = this.generateRelationshipIndex();
        var relationshipId = optionalId || `${relationship.index}`;
        relationship.id = relationshipId;
        this.relationships.set(relationshipId, relationship);
        return relationship;
    }
    ;
    nodeList() {
        return Array.from(this.nodes.values());
    }
    ;
    lookupNode(nodeId) {
        return this.nodes.get(`${nodeId}`);
    }
    ;
    relationshipList() {
        return Array.from(this.relationships.values());
    }
    ;
    groupedRelationshipList() {
        var groups = {};
        this.relationships.forEach((relationship, id, map) => {
            var nodeIds = [relationship.start.id, relationship.end.id].sort();
            var group = groups[nodeIds];
            if (!group) {
                group = groups[nodeIds] = [];
            }
            if (relationship.start.id < relationship.end.id) {
                group.push(relationship);
            }
            else {
                group.splice(0, 0, relationship);
            }
        });
        return d3.values(groups);
    }
    ;
    set id(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
    set internalScale(newScale) {
        this._internalScale = newScale; //NOTE parseFloat(newScale);
    }
    ;
    get internalScale() {
        return this._internalScale;
    }
    set externalScale(newScale) {
        this._externalScale = newScale; //NOTE parseFloat(newScale);
    }
    ;
    get externalScale() {
        return this._externalScale;
    }
}
exports.default = Model;
;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = __webpack_require__(13);
const Properties_1 = __webpack_require__(14);
const SimpleStyle_1 = __webpack_require__(2);
class Node extends Entity_1.default {
    constructor(model) {
        super(model);
        this.position = {};
        this.radius = 25; //TODO get the actual radius, i.e. from LayoutNode
        this._entityType = "node";
        this._properties = new Properties_1.default(model.stylePrototype.nodeProperties);
        this._style = new SimpleStyle_1.default(model.stylePrototype.node);
        this._caption = "";
    }
    set x(x) {
        this.position.x = Number(x);
    }
    ;
    get x() {
        return this.position.x;
    }
    set y(y) {
        this.position.y = Number(y);
    }
    get y() {
        return this.position.y;
    }
    // funky usage precludes get/set for now
    ex() {
        return this.position.x * this.model.internalScale;
    }
    // funky usage precludes get/set for now
    ey() {
        return this.position.y * this.model.internalScale;
    }
    distanceTo(node) {
        var dx = node.x - this.x;
        var dy = node.y - this.y;
        return Math.sqrt(dx * dx + dy * dy) * this.model.internalScale;
    }
    snap(position, field, node) {
        var ideal = position[field];
        var closestNode;
        var closestDistance = Number.MAX_VALUE;
        for (var nodeId in this.model.nodes) {
            if (this.model.nodes.hasOwnProperty(nodeId)) {
                var candidateNode = this.model.nodes[nodeId];
                if (candidateNode != node) {
                    // console.log(`Node: snap: field: ${field}`)
                    var distance = 0;
                    if (field == "x") {
                        distance = Math.abs(candidateNode.x - ideal);
                    }
                    else if (field == "y") {
                        distance = Math.abs(candidateNode.y - ideal);
                    }
                    // var distance = Math.abs(candidateNode[field]() - ideal); //TODO find a better way to reference accessors of Node
                    if (distance < closestDistance) {
                        closestNode = candidateNode;
                        closestDistance = distance;
                    }
                }
            }
        }
        if (closestDistance < this.model.parameters.snapTolerance) {
            if (field == "x") {
                return closestNode.x;
            }
            else if (field == "y") {
                return closestNode.y;
            }
        }
        else {
            if (field == "x") {
                return position.x;
            }
            else if (field == "y") {
                return position.y;
            }
        }
    }
    drag(dx, dy) {
        if (!this.prototypePosition) {
            this.prototypePosition = {
                x: this.position.x,
                y: this.position.y
            };
        }
        this.prototypePosition.x += dx / this.model.internalScale;
        this.prototypePosition.y += dy / this.model.internalScale;
        this.position.x = this.snap(this.prototypePosition, "x", this); //TODO
        this.position.y = this.snap(this.prototypePosition, "y", this); //TODO
        // console.log(this.position, this.prototypePosition, this.model.internalScale);
    }
    dragEnd() {
        this.prototypePosition = undefined;
        // console.log(this.position, this.prototypePosition);
    }
    // distance() {
    //     var dx = this.node.x - this.x;
    //     var dy = this.node.y - this.y;
    //     return Math.sqrt(dx * dx + dy * dy) * this.model.internalScale;
    // };
    angleTo(node) {
        var dx = node.x - this.x;
        var dy = node.y - this.y;
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }
    ;
    isLeftOf(node) {
        return this.x < node.x;
    }
    ;
}
exports.default = Node;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GraphDiagram_1 = __webpack_require__(0);
class Entity {
    constructor(model) {
        this.classes = [];
        this.model = model;
        this._caption = "";
        this._entityType = "";
    }
    style(cssPropertyKey, cssPropertyValue) {
        return this._style.style(cssPropertyKey, cssPropertyValue);
    }
    class(classesString) {
        if (arguments.length == 1) {
            this.classes = classesString.split(" ").filter((className) => {
                return className.length > 0 && className != this._entityType;
            });
            return this;
        }
        return [this._entityType].concat(this.classes);
    }
    ;
    set caption(captionText) {
        this._caption = captionText;
    }
    get caption() {
        return this._caption;
    }
    get displayCaption() {
        let name = this.properties.has('name');
        if (name) {
            return `${this._caption}: ${name}`;
        }
        else {
            return this._caption;
        }
    }
    get properties() {
        if (this.model.id) {
            this._properties.set(GraphDiagram_1.default.MODEL_ID_KEY, this.model.id);
        }
        return this._properties;
    }
}
exports.default = Entity;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GraphDiagram_1 = __webpack_require__(0);
const SimpleStyle_1 = __webpack_require__(2);
class Properties {
    constructor(stylePrototype) {
        this._propertiesMap = new Map();
        this._style = new SimpleStyle_1.default(stylePrototype);
    }
    style(cssPropertyKey, cssPropertyValue) {
        return this._style.style(cssPropertyKey, cssPropertyValue);
    }
    list(options) {
        let exclude;
        if (options) {
            exclude = options.exclude;
        }
        let result = [];
        this._propertiesMap.forEach((value, key) => {
            if (!exclude || exclude.indexOf(key) == -1) {
                result.push({ key: key, value: value });
            }
        });
        return result;
    }
    ;
    listEditable() {
        return this.list({ exclude: [GraphDiagram_1.default.MODEL_ID_KEY] });
    }
    toJSON() {
        let properties = {};
        this.list().forEach((propertyObj) => {
            properties[propertyObj.key] = propertyObj.value;
        });
        return properties;
    }
    toString() {
        return JSON.stringify(this.list());
    }
    set(key, value) {
        // if (!this.values[key]) {
        //     this.keys.push(key);
        // }
        // this.values[key] = value;
        this._propertiesMap.set(key, value);
        return this;
    }
    ;
    has(property) {
        return this._propertiesMap.get(property);
    }
    clearAll() {
        // this.keys = [];
        // this.values = {};
        this._propertiesMap = new Map();
    }
    ;
}
exports.default = Properties;
;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = __webpack_require__(13);
const Properties_1 = __webpack_require__(14);
const SimpleStyle_1 = __webpack_require__(2);
class Relationship extends Entity_1.default {
    constructor(model, start, end) {
        super(model);
        this._entityType = "relationship";
        this.start = start;
        this.end = end;
        this._properties = new Properties_1.default(model.stylePrototype.relationshipProperties);
        this._style = new SimpleStyle_1.default(model.stylePrototype.relationship);
    }
    set relationshipType(relationshipTypeText) {
        this._relationshipType = relationshipTypeText;
    }
    get relationshipType() {
        return this._relationshipType;
    }
    reverse() {
        var oldStart = this.start;
        this.start = this.end;
        this.end = oldStart;
    }
}
exports.default = Relationship;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DataTypes {
}
exports.DataTypes = DataTypes;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __webpack_require__(1);
const GraphDiagram_1 = __webpack_require__(0);
const Layout_1 = __webpack_require__(4);
const Scaling_1 = __webpack_require__(10);
var thiz;
class Diagram {
    constructor() {
        this._renderPropertyBubblesFlag = true;
        this._overlay = function (layoutModel, view) { };
        this._scaling = Scaling_1.default.sizeSvgToFitDiagram;
        thiz = this;
    }
    overlay(behaviour) {
        this._overlay = behaviour;
        return this;
    }
    ;
    scaling(scalingFunction) {
        this._scaling = scalingFunction;
        return this;
    }
    ;
    toggleRenderPropertyBubblesFlag() {
        this._renderPropertyBubblesFlag = !this._renderPropertyBubblesFlag;
    }
    renderNodes(nodes, view) {
        function nodeClasses(d) {
            let result = d.model.class().join(" ") + " " + "node-id-" + d.model.id + ` node-base node-type-${d.model.caption}`;
            return result;
        }
        var circles = view.selectAll("circle.node").data(nodes);
        circles.exit().remove();
        var circlesEnter = circles.enter().append("svg:circle")
            .attr("class", nodeClasses)
            .merge(circles)
            .attr("r", function (node) {
            return node.radius.mid();
        })
            .attr("fill", function (node) {
            return node.model.style("background-color");
        })
            .attr("stroke", function (node) {
            return node.model.style("border-color");
        })
            .attr("stroke-width", function (node) {
            return node.model.style("border-width");
        })
            .attr("cx", function (node) {
            var ex = node.model.ex();
            return ex;
        })
            .attr("cy", function (node) {
            return node.model.ey();
        });
        function captionClasses(line) {
            return "caption " + line.node.model.class().join(" ") + " " + "node-id-" + line.node.model.id + ` node-type-${line.node.model.caption}`;
        }
        var nodesWithCaptions = nodes.filter(function (node) { return node.model.displayCaption; });
        var captionGroups = view.selectAll("g.caption")
            .data(nodesWithCaptions);
        captionGroups.exit().remove();
        var captionGroupsEnter = captionGroups.enter().append("g")
            .attr("class", "caption");
        var captionGroupsMerge = captionGroups.merge(captionGroupsEnter);
        var captions = captionGroupsMerge.selectAll("text.caption")
            .data(function (node) {
            var data = node.captionLines.map(function (line) {
                return { node: node, caption: line };
            });
            return data;
        });
        captions.exit().remove();
        var captionsEnter = captions.enter().append("svg:text")
            .attr("class", captionClasses);
        var captionsMerge = captions.merge(captionsEnter);
        captionsMerge
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .attr("x", function (line) { return line.node.model.ex(); })
            .attr("y", function (line, i) { return line.node.model.ey() + (i - (line.node.captionLines.length - 1) / 2) * line.node.captionLineHeight; })
            .attr("fill", function (line) { return line.node.model.style("color"); })
            .attr("font-size", function (line) { return line.node.model.style("font-size"); })
            .attr("font-family", function (line) { return line.node.model.style("font-family"); })
            .text(function (line) {
            return line.caption;
        });
    }
    renderRelationships(relationshipGroups, view) {
        function translateToStartNodeCenterAndRotateToRelationshipAngle(r) {
            var angle = r.start.model.angleTo(r.end.model);
            return "translate(" + r.start.model.ex() + "," + r.start.model.ey() + ") rotate(" + angle + ")";
        }
        function rotateIfRightToLeft(r) {
            return r.end.model.isLeftOf(r.start.model) ? "rotate(180)" : null;
        }
        function side(r) {
            return r.end.model.isLeftOf(r.start.model) ? -1 : 1;
        }
        function relationshipClasses(d) {
            var r = d.model;
            return r.class().join(" ");
        }
        var relatedNodesGroup = view.selectAll("g.related-pair")
            .data(relationshipGroups);
        relatedNodesGroup.exit().remove();
        var relatedNodesGroupEnter = relatedNodesGroup.enter().append("svg:g")
            .attr("class", "related-pair");
        var relatedNodesGroupMerge = relatedNodesGroup.merge(relatedNodesGroupEnter);
        var relationshipGroup = relatedNodesGroupMerge.selectAll("g.relationship")
            .data(function (d) { return d; });
        relationshipGroup.exit().remove();
        var relationshipGroupEnter = relationshipGroup.enter().append("svg:g")
            .attr("class", relationshipClasses);
        var relationshipGroupMerge = relationshipGroup.merge(relationshipGroupEnter);
        relationshipGroupMerge
            .attr("transform", translateToStartNodeCenterAndRotateToRelationshipAngle);
        var relationshipPath = relationshipGroupMerge.selectAll("path.relationship")
            .data(function (d) { return [d]; });
        var relationshipPathEnter = relationshipPath.enter().append("svg:path")
            .attr("class", relationshipClasses);
        var relationshipPathMerge = relationshipPath.merge(relationshipPathEnter);
        relationshipPathMerge
            .attr("d", function (d) { return d.arrow.outline; })
            .attr("fill", function (node) {
            return node.model.style("background-color");
        })
            .attr("stroke", function (node) {
            return node.model.style("border-color");
        })
            .attr("stroke-width", function (node) {
            return node.model.style("border-width");
        });
        function relationshipWithRelationshipType(d) {
            return [d].filter(function (d) { return d.model.relationshipType; });
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
            .attr("x", function (d) { return side(d) * d.arrow.apex.x; })
            .attr("y", function (d) { return side(d) * d.arrow.apex.y; })
            .attr("font-size", function (d) { return d.model.style("font-size"); })
            .attr("font-family", function (d) { return d.model.style("font-family"); })
            .text(function (d) { return d.model.relationshipType; });
    }
    renderPropertyBubbles(entities, descriminator, view) {
        var entitiesWithProperties = entities.filter(GraphDiagram_1.default.hasProperties);
        var propertiesData = entitiesWithProperties.map(function (entity) { return entity.propertiesBubble; });
        var speechBubbleGroup = view.selectAll("g.speech-bubble." + descriminator + "-speech-bubble")
            .data(propertiesData);
        speechBubbleGroup.exit().remove();
        var speechBubbleGroupEnter = speechBubbleGroup.enter().append("svg:g")
            .attr("class", "speech-bubble " + descriminator + "-speech-bubble");
        var speechBubbleGroupMerge = speechBubbleGroup.merge(speechBubbleGroupEnter);
        speechBubbleGroupMerge
            .attr("transform", function (speechBubble) {
            return speechBubble.groupTransform;
        });
        // toggle visibility of property bubbles
        if (thiz._renderPropertyBubblesFlag) {
            speechBubbleGroupMerge.attr("display", "block");
        }
        else {
            speechBubbleGroupMerge.attr("display", "none");
        }
        var speechBubbleOutline = speechBubbleGroupMerge.selectAll("path.speech-bubble-outline")
            .data(function (d) { return [d]; });
        speechBubbleOutline.exit().remove();
        var speechBubbleOutlineEnter = speechBubbleOutline.enter().append("svg:path")
            .attr("class", "speech-bubble-outline");
        var speechBubbleOutlineMerge = speechBubbleOutline.merge(speechBubbleOutlineEnter);
        speechBubbleOutlineMerge
            .attr("transform", function (speechBubble) {
            return speechBubble.outlineTransform;
        })
            .attr("d", function (speechBubble) {
            return speechBubble.outlinePath;
        })
            .attr("fill", function (speechBubble) {
            return speechBubble.entity.properties.style("background-color");
        })
            .attr("stroke", function (speechBubble) {
            return speechBubble.entity.properties.style("border-color");
        })
            .attr("stroke-width", function (speechBubble) {
            return speechBubble.entity.properties.style("border-width");
        });
        var propertyKeys = speechBubbleGroupMerge.selectAll("text.speech-bubble-content.property-key")
            .data(function (speechBubble) {
            return speechBubble.properties;
        });
        propertyKeys.exit().remove();
        var propertyKeysEnter = propertyKeys.enter().append("svg:text")
            .attr("class", "speech-bubble-content property-key");
        var propertyKeysEnterMerge = propertyKeys.merge(propertyKeysEnter);
        propertyKeysEnterMerge
            .attr("x", function (properties) {
            return properties.textOrigin.x;
        })
            .attr("y", function (properties, i) {
            return (i + 0.5) * GraphDiagram_1.default.parsePixels(properties.entity.properties.style("font-size")) + properties.textOrigin.y;
        })
            .attr("alignment-baseline", "central")
            .attr("text-anchor", "end")
            .attr("font-size", function (properties) { return properties.entity.properties.style("font-size"); })
            .attr("font-family", function (properties) { return properties.entity.properties.style("font-family"); })
            .attr("xml:space", "preserve")
            .text(function (properties) {
            return properties.keyText;
        });
        var propertyValues = speechBubbleGroupMerge.selectAll("text.speech-bubble-content.property-value")
            .data(function (speechBubble) {
            return speechBubble.properties;
        });
        propertyValues.exit().remove();
        var propertyValuesEnter = propertyValues.enter().append("svg:text")
            .attr("class", "speech-bubble-content property-value");
        var propertyValuesMerge = propertyValues.merge(propertyValuesEnter);
        propertyValuesMerge
            .attr("x", function (properties) {
            return properties.textOrigin.x;
        })
            .attr("y", function (properties, i) {
            return (i + 0.5) * GraphDiagram_1.default.parsePixels(properties.entity.properties.style("font-size")) + properties.textOrigin.y;
        })
            .attr("alignment-baseline", "central")
            .attr("font-size", function (properties) { return properties.entity.properties.style("font-size"); })
            .attr("font-family", function (properties) { return properties.entity.properties.style("font-family"); })
            .text(function (properties) {
            return properties.valueText;
        });
    }
    render(selection) {
        selection.each(function (model) {
            var view = d3.select(this);
            thiz.layout = new Layout_1.default(model);
            var layoutModel = thiz.layout.layoutModel;
            function layer(name) {
                var layer = view.selectAll("g.layer." + name).data([name]);
                var layerEnter = layer.enter().append("g")
                    .attr("class", "layer " + name);
                var result = layer.merge(layerEnter);
                return result;
            }
            thiz.renderRelationships(layoutModel.relationshipGroups, layer("relationships"));
            thiz.renderNodes(layoutModel.nodes, layer("nodes"));
            thiz.renderPropertyBubbles(layoutModel.nodes, "node", layer("node_properties"));
            thiz.renderPropertyBubbles(layoutModel.relationships, "relationship", layer("relationship_properties"));
            if (thiz._overlay) {
                thiz._overlay(layoutModel, layer("overlay"));
            }
            if (thiz._scaling) {
                thiz._scaling(layoutModel, view);
            }
        });
    }
}
exports.default = Diagram;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __webpack_require__(1);
const GraphDiagram_1 = __webpack_require__(0);
const Bubble_1 = __webpack_require__(7);
class RelationshipSpeechBubble extends Bubble_1.default {
    constructor(relationship, apex) {
        super(relationship);
        var properties = relationship.properties;
        var fontSize = relationship.properties.style("font-size");
        var fontFamily = relationship.properties.style("font-family");
        var orientation = RelationshipSpeechBubble.chooseRelationshipSpeechBubbleOrientation(relationship);
        var propertyKeysWidth = d3.max(properties.listEditable(), function (property) {
            return GraphDiagram_1.default.measureTextDimensions(property.key + ": ", fontSize, fontFamily);
        });
        var propertyValuesWidth = d3.max(properties.listEditable(), function (property) {
            return GraphDiagram_1.default.measureTextDimensions(property.value, fontSize, fontFamily);
        });
        var textSize = {
            width: propertyKeysWidth + propertyValuesWidth,
            height: properties.listEditable().length * GraphDiagram_1.default.parsePixels(properties.style("font-size"))
        };
        var margin = GraphDiagram_1.default.parsePixels(properties.style("margin"));
        var padding = GraphDiagram_1.default.parsePixels(properties.style("padding"));
        var mirror = "scale(" + orientation.mirrorX + "," + orientation.mirrorY + ") ";
        var nodeOffsetOptions = {
            diagonal: {
                textCorner: {
                    x: margin + padding,
                    y: margin + padding
                }
            },
            horizontal: {
                textCorner: {
                    x: margin + padding,
                    y: -textSize.height / 2
                }
            },
            vertical: {
                textCorner: {
                    x: -textSize.width / 2,
                    y: margin + padding
                }
            }
        };
        var textCorner = nodeOffsetOptions[orientation.style].textCorner;
        var dx = relationship.end.ex() - relationship.start.ex();
        var dy = relationship.end.ey() - relationship.start.ey();
        var h = Math.sqrt(dx * dx + dy * dy);
        var midPoint = {
            x: relationship.start.ex() + (apex.x * dx - apex.y * dy) / h,
            y: relationship.start.ey() + (apex.x * dy + apex.y * dx) / h
        };
        var translate = "translate(" + midPoint.x + "," + midPoint.y + ") ";
        var textOrigin = {
            x: propertyKeysWidth + orientation.mirrorX * (textCorner.x)
                - (orientation.mirrorX == -1 ? textSize.width : 0),
            y: orientation.mirrorY * (textCorner.y)
                - (orientation.mirrorY == -1 ? textSize.height : 0)
        };
        var boundingPadding = padding + relationship.model.parameters.speechBubbleStrokeWidth / 2;
        var boundingBox = {
            x: midPoint.x + (textCorner.x - boundingPadding) * orientation.mirrorX,
            y: midPoint.y + (textCorner.y - boundingPadding) * orientation.mirrorY,
            width: orientation.mirrorX * (textSize.width + (boundingPadding * 2)),
            height: orientation.mirrorY * (textSize.height + (boundingPadding * 2))
        };
        this.properties = properties.listEditable().map(function (property) {
            return {
                keyText: property.key + ": ",
                valueText: property.value,
                textOrigin: textOrigin,
                style: relationship.style(),
                entity: relationship
            };
        });
        this.style = relationship.style();
        this.entity = relationship;
        this.groupTransform = translate;
        this.outlineTransform = mirror;
        this.outlinePath = Bubble_1.default.speechBubblePath(textSize, orientation.style, margin, padding);
        this.boundingBox = boundingBox;
    }
    static chooseRelationshipSpeechBubbleOrientation(relationship) {
        var orientations = {
            EAST: { style: "horizontal", mirrorX: 1, mirrorY: 1, angle: 0 },
            SOUTH_EAST: { style: "diagonal", mirrorX: 1, mirrorY: 1, angle: 45 },
            SOUTH: { style: "vertical", mirrorX: 1, mirrorY: 1, angle: 90 },
            SOUTH_WEST: { style: "diagonal", mirrorX: -1, mirrorY: 1, angle: 135 },
            WEST: { style: "horizontal", mirrorX: -1, mirrorY: 1, angle: 180 }
        };
        var relationshipAngle = relationship.start.angleTo(relationship.end);
        var positiveAngle = relationshipAngle > 0 ? relationshipAngle : relationshipAngle + 180;
        if (positiveAngle > 175 || positiveAngle < 5) {
            return orientations.SOUTH;
        }
        else if (positiveAngle < 85) {
            return orientations.SOUTH_WEST;
        }
        else if (positiveAngle < 90) {
            return orientations.WEST;
        }
        else if (positiveAngle === 90) {
            return relationshipAngle > 0 ? orientations.WEST : orientations.EAST;
        }
        else if (positiveAngle < 95) {
            return orientations.EAST;
        }
        else {
            return orientations.SOUTH_EAST;
        }
    }
}
exports.default = RelationshipSpeechBubble;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __webpack_require__(1);
const GraphDiagram_1 = __webpack_require__(0);
const Bubble_1 = __webpack_require__(7);
class NodeSpeechBubble extends Bubble_1.default {
    constructor(node, radius) {
        super(node);
        var relatedNodes = [];
        node.model.relationshipList().forEach(function (relationship) {
            if (relationship.start === node) {
                relatedNodes.push(relationship.end);
            }
            if (relationship.end === node) {
                relatedNodes.push(relationship.start);
            }
        });
        var orientation = NodeSpeechBubble.chooseNodeSpeechBubbleOrientation(node, relatedNodes);
        var properties = node.properties;
        var propertyKeysWidth = d3.max(properties.listEditable(), function (property) {
            return GraphDiagram_1.default.measureTextDimensions(property.key + ": ", node.properties.style("font-size"), node.properties.style("font-family"));
        });
        var propertyValuesWidth = d3.max(properties.listEditable(), function (property) {
            return GraphDiagram_1.default.measureTextDimensions(property.value, node.properties.style("font-size"), node.properties.style("font-family"));
        });
        var textSize = {
            width: parseFloat(propertyKeysWidth) + parseFloat(propertyValuesWidth),
            height: properties.listEditable().length * GraphDiagram_1.default.parsePixels(properties.style("font-size"))
        };
        var mirror = "scale(" + orientation.mirrorX + "," + orientation.mirrorY + ") ";
        var margin = GraphDiagram_1.default.parsePixels(properties.style("margin"));
        var padding = GraphDiagram_1.default.parsePixels(properties.style("padding"));
        var diagonalRadius = radius.mid() * Math.sqrt(2) / 2;
        var nodeOffsetOptions = {
            diagonal: { attach: { x: diagonalRadius, y: diagonalRadius },
                textCorner: {
                    x: margin + padding,
                    y: margin + padding
                } },
            horizontal: { attach: { x: radius.mid(), y: 0 },
                textCorner: {
                    x: margin + padding,
                    y: -textSize.height / 2
                } },
            vertical: { attach: { x: 0, y: radius.mid() },
                textCorner: {
                    x: -textSize.width / 2,
                    y: margin + padding
                } }
        };
        var nodeCenterOffset = nodeOffsetOptions[orientation.style].attach;
        var textCorner = nodeOffsetOptions[orientation.style].textCorner;
        var translate = "translate(" + (node.ex() + nodeCenterOffset.x * orientation.mirrorX) + ","
            + (node.ey() + nodeCenterOffset.y * orientation.mirrorY) + ") ";
        var textOrigin = {
            x: parseFloat(propertyKeysWidth) + orientation.mirrorX * (textCorner.x)
                - (orientation.mirrorX == -1 ? textSize.width : 0),
            y: orientation.mirrorY * (textCorner.y)
                - (orientation.mirrorY == -1 ? textSize.height : 0)
        };
        var boundingPadding = padding + node.model.parameters.speechBubbleStrokeWidth / 2;
        var boundingBox = {
            x: node.ex() + (nodeCenterOffset.x + textCorner.x - boundingPadding) * orientation.mirrorX,
            y: node.ey() + (nodeCenterOffset.y + textCorner.y - boundingPadding) * orientation.mirrorY,
            width: orientation.mirrorX * (textSize.width + (boundingPadding * 2)),
            height: orientation.mirrorY * (textSize.height + (boundingPadding * 2))
        };
        this.properties = properties.listEditable().map(function (property) {
            return {
                keyText: property.key + ": ",
                valueText: property.value,
                textOrigin: textOrigin,
                style: node.style(),
                entity: node
            };
        });
        this.style = node.style();
        this.groupTransform = translate;
        this.outlineTransform = mirror;
        this.outlinePath = Bubble_1.default.speechBubblePath(textSize, orientation.style, margin, padding),
            this.boundingBox = boundingBox;
    }
}
NodeSpeechBubble.chooseNodeSpeechBubbleOrientation = function (focusNode, relatedNodes) {
    var orientations = [
        { key: "WEST", style: "horizontal", mirrorX: -1, mirrorY: 1, angle: 180 },
        { key: "NORTH-WEST", style: "diagonal", mirrorX: -1, mirrorY: -1, angle: -135 },
        { key: "NORTH", style: "vertical", mirrorX: 1, mirrorY: -1, angle: -90 },
        { key: "NORTH-EAST", style: "diagonal", mirrorX: 1, mirrorY: -1, angle: -45 },
        { key: "EAST", style: "horizontal", mirrorX: 1, mirrorY: 1, angle: 0 },
        { key: "SOUTH-EAST", style: "diagonal", mirrorX: 1, mirrorY: 1, angle: 45 },
        { key: "SOUTH", style: "vertical", mirrorX: 1, mirrorY: 1, angle: 90 },
        { key: "SOUTH-WEST", style: "diagonal", mirrorX: -1, mirrorY: 1, angle: 135 }
    ];
    orientations.forEach(function (orientation) {
        orientation.closest = 180;
    });
    relatedNodes.forEach(function (relatedNode) {
        orientations.forEach(function (orientation) {
            var angle = Math.abs(focusNode.angleTo(relatedNode) - orientation.angle);
            if (angle > 180) {
                angle = 360 - angle;
            }
            if (angle < orientation.closest) {
                orientation.closest = angle;
            }
        });
    });
    var maxAngle = 0;
    var bestOrientation = orientations[0];
    orientations.forEach(function (orientation) {
        if (orientation.closest > maxAngle) {
            maxAngle = orientation.closest;
            bestOrientation = orientation;
        }
    });
    return bestOrientation;
};
exports.default = NodeSpeechBubble;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Radius {
    constructor(model, insideRadius) {
        this.insideRadius = insideRadius;
        this.borderWidth = model.parameters.nodeStrokeWidth;
        this.arrowMargin = model.parameters.nodeStartMargin;
    }
    inside(insideRadius) {
        if (arguments.length == 1) {
            this.insideRadius = insideRadius;
            return this;
        }
        return this.insideRadius;
    }
    ;
    get border() {
        return this.borderWidth;
    }
    set border(borderWidth) {
        this.borderWidth = borderWidth;
    }
    ;
    get margin() {
        return this.arrowMargin;
    }
    set margin(arrowMargin) {
        this.arrowMargin = arrowMargin;
    }
    ;
    mid() {
        return this.insideRadius + this.borderWidth / 2;
    }
    ;
    outside() {
        return this.insideRadius + this.borderWidth;
    }
    ;
    startRelationship() {
        return this.insideRadius + this.borderWidth + this.arrowMargin;
    }
    ;
    endRelationship() {
        return this.insideRadius + this.borderWidth + this.arrowMargin;
    }
    ;
}
exports.default = Radius;
;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class HorizontalArrowOutline {
    constructor(start, end, arrowWidth) {
        this.shaftRadius = arrowWidth / 2;
        this.headRadius = arrowWidth * 2;
        this.headLength = this.headRadius * 2;
        this.shoulder = start < end ? end - this.headLength : end + this.headLength;
        this.outline = [
            "M", start, this.shaftRadius,
            "L", this.shoulder, this.shaftRadius,
            "L", this.shoulder, this.headRadius,
            "L", end, 0,
            "L", this.shoulder, -this.headRadius,
            "L", this.shoulder, -this.shaftRadius,
            "L", start, -this.shaftRadius,
            "Z"
        ].join(" ");
        this.apex = {
            x: start + (this.shoulder - start) / 2,
            y: 0
        };
    }
}
exports.default = HorizontalArrowOutline;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __webpack_require__(1);
const Model_1 = __webpack_require__(11);
const SimpleStyle_1 = __webpack_require__(2);
class Markup {
    static parseAll(selection) {
        var models = [];
        selection.each(function () {
            var selx = d3.select(this);
            var modelx = Markup.parse(selx);
            // console.log(this, selx, modelx);
            // debugger;
            models.push(modelx);
        });
        return models;
    }
    static parseProperties(entity, debug = false) {
        return function () {
            var propertiesMarkup = d3.select(this);
            if (debug) {
                console.log(`parseProperties:`, entity, this, propertiesMarkup);
            }
            var elements = propertiesMarkup.selectAll("dt, dd");
            var currentKey;
            elements.each(function () {
                if (this.nodeName.toLowerCase() === "dt") {
                    currentKey = d3.select(this).text();
                }
                else if (currentKey && this.nodeName.toLowerCase() === "dd") {
                    entity.properties.set(currentKey, d3.select(this).text());
                }
            });
            SimpleStyle_1.default.copyStyles(entity.properties, propertiesMarkup, debug);
        };
    }
    static parse(selection, modelId) {
        var model = new Model_1.default(modelId);
        if (selection.attr("data-internal-scale")) {
            model.internalScale = selection.attr("data-internal-scale");
        }
        if (selection.attr("data-external-scale")) {
            model.externalScale = selection.attr("data-external-scale");
        }
        var nodePrototype = selection.append("li").attr("class", "node");
        var nodePropertiesPrototype = nodePrototype.append("dl").attr("class", "properties");
        SimpleStyle_1.default.copyStyles(model.stylePrototype.node, nodePrototype);
        SimpleStyle_1.default.copyStyles(model.stylePrototype.nodeProperties, nodePropertiesPrototype);
        nodePrototype.remove();
        var relationshipPrototype = selection.append("li").attr("class", "relationship");
        var relationshipPropertiesPrototype = relationshipPrototype.append("dl").attr("class", "properties");
        SimpleStyle_1.default.copyStyles(model.stylePrototype.relationship, relationshipPrototype);
        SimpleStyle_1.default.copyStyles(model.stylePrototype.relationshipProperties, relationshipPropertiesPrototype);
        relationshipPrototype.remove();
        selection.selectAll(".node").each(function () {
            var nodeMarkup = d3.select(this); //TODO
            var id = nodeMarkup.attr("data-node-id");
            var node = model.createNode(id);
            node.class(nodeMarkup.attr("class") || "");
            node.x = parseFloat(nodeMarkup.attr("data-x"));
            node.y = parseFloat(nodeMarkup.attr("data-y"));
            nodeMarkup.select("span.caption").each(function () {
                node.caption = d3.select(this).text(); //TODO
            });
            nodeMarkup.select("dl.properties").each(Markup.parseProperties(node));
            SimpleStyle_1.default.copyStyles(node, nodeMarkup);
        });
        selection.selectAll(".relationship").each(function () {
            // console.log(`parsing relationship:`, this)
            var relationshipMarkup = d3.select(this); //TODO
            var fromId = parseFloat(relationshipMarkup.attr("data-from"));
            var toId = parseFloat(relationshipMarkup.attr("data-to"));
            var relationship = model.createRelationship(model.lookupNode(fromId), model.lookupNode(toId));
            relationship.class(relationshipMarkup.attr("class") || "");
            relationshipMarkup.select("span.type").each(function () {
                relationship.relationshipType = d3.select(this).text();
                // console.log(`span.type:`, this, relationship.relationshipType);
            });
            // console.log(`relationshipMarkup:`, relationshipMarkup, relationship.relationshipType);
            var temp = relationshipMarkup.select("dl.properties").each(Markup.parseProperties(relationship, false));
            // console.log(temp);
            SimpleStyle_1.default.copyStyles(relationship, relationshipMarkup, false);
            // console.log(relationship);
        });
        return model;
    }
    static format(model, container) {
        var ul = container.append("ul")
            .attr("class", "graph-diagram-markup")
            .attr("data-internal-scale", model.internalScale)
            .attr("data-external-scale", model.externalScale);
        function formatProperties(entity, li) {
            if (entity.properties.list().length > 0) {
                var dl = li.append("dl")
                    .attr("class", "properties");
                entity.properties.list().forEach(function (property) {
                    dl.append("dt")
                        .text(property.key);
                    dl.append("dd")
                        .text(property.value);
                });
            }
        }
        model.nodeList().forEach(function (node) {
            var li = ul.append("li")
                .attr("class", node.class().join(" "))
                .attr("data-node-id", node.id)
                .attr("data-x", node.x)
                .attr("data-y", node.y);
            if (node.caption) {
                li.append("span")
                    .attr("class", "caption")
                    .text(node.caption);
            }
            formatProperties(node, li);
        });
        model.relationshipList().forEach(function (relationship) {
            var li = ul.append("li")
                .attr("class", relationship.class().join(" "))
                .attr("data-from", relationship.start.id)
                .attr("data-to", relationship.end.id);
            if (relationship.relationshipType) {
                li.append("span")
                    .attr("class", "type")
                    .text(relationship.relationshipType);
            }
            formatProperties(relationship, li);
        });
    }
}
exports.default = Markup;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ModelToCypher {
    static convert(model) {
        var statements = [];
        model.nodeList().forEach((node) => {
            statements.push("(" + ModelToCypher.quote(node.id) + " :" + ModelToCypher.quote(node.caption || "Node") + " " + ModelToCypher.render(ModelToCypher.props(node)) + ") ");
        });
        model.relationshipList().forEach((rel) => {
            statements.push("(" + ModelToCypher.quote(rel.start.id) +
                ")-[:`" + ModelToCypher.quote(rel.relationshipType || "RELATED_TO") +
                "` " + ModelToCypher.render(ModelToCypher.props(rel)) +
                "]->(" + ModelToCypher.quote(rel.end.id) + ")");
        });
        if (statements.length == 0)
            return "";
        return "CREATE \n  " + statements.join(",\n  ");
    }
    static props(element) {
        var props = {};
        element.properties.list().forEach((property) => {
            props[property.key] = property.value;
        });
        return props;
    }
    static isIdentifier(name) {
        return /^[_a-zA-Z]\w*$/.test(name);
    }
    static quote(name) {
        return ModelToCypher.isIdentifier(name) ? name : "`" + name + "`";
    }
    static render(props) {
        var res = "";
        for (var key in props) {
            if (res.length > 0)
                res += ",";
            if (props.hasOwnProperty(key)) {
                res += ModelToCypher.quote(key) + ":";
                var value = props[key];
                res += typeof value == "string" && value[0] != "'" && value[0] != '"' ? "'" + value + "'" : value;
            }
        }
        return res.length == 0 ? "" : "{" + res + "}";
    }
}
exports.default = ModelToCypher;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __webpack_require__(3);
const DataTypes_1 = __webpack_require__(16);
class ModelToD3 {
    constructor() {
        this.dataTypes = new DataTypes_1.DataTypes(); // included to force DataTypes to be included in d.ts
    }
    static convert(model) {
        let graph = {
            nodes: [],
            links: []
        };
        model.nodeList().forEach((node) => {
            let nodeData = {
                id: node.id,
                group: 1,
                properties: node.properties.toJSON(),
                labels: [node.caption]
            };
            graph.nodes.push(nodeData);
        });
        model.relationshipList().forEach((relationship) => {
            let relationshipData = {
                source: relationship.start.id,
                target: relationship.end.id,
                value: 1,
                id: relationship.id,
                type: relationship.relationshipType,
                startNode: relationship.start.id,
                endNode: relationship.end.id,
                properties: relationship.properties.toJSON(),
                linknum: 1
            };
            graph.links.push(relationshipData);
        });
        return graph;
    }
    static parseD3(data, modelId, origin) {
        var model = new __1.Model(modelId);
        data.nodes.forEach((nodeData) => {
            let newNode = model.createNode(nodeData.id);
            if (origin) {
                newNode.x = origin.x;
                newNode.y = origin.y;
            }
            newNode.caption = nodeData.labels[0];
            let properties = nodeData.properties;
            for (let key in properties) {
                if (properties.hasOwnProperty(key)) {
                    newNode.properties.set(key, properties[key]);
                }
            }
        });
        data.links.forEach((linkData) => {
            let fromId = linkData.startNode;
            let toId = linkData.endNode;
            let newRelationship = model.createRelationship(model.lookupNode(fromId), model.lookupNode(toId));
            newRelationship.caption = linkData.type;
            newRelationship.relationshipType = linkData.type;
            newRelationship.id = linkData.id;
            let properties = linkData.properties;
            for (let key in properties) {
                if (properties.hasOwnProperty(key)) {
                    newRelationship.properties.set(key, properties[key]);
                }
            }
        });
        return model;
    }
}
exports.default = ModelToD3;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class layoutModel {
    constructor(model) {
        this.graphModel = model;
        this.nodes = [];
        this.relationships = [];
        this.relationshipGroups = [];
    }
}
exports.default = layoutModel;


/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map
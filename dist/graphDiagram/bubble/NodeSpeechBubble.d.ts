import Node from '../model/Node';
import Radius from './Radius';
import Bubble from './Bubble';
export default class NodeSpeechBubble extends Bubble {
    constructor(node: Node, radius: Radius);
    static chooseNodeSpeechBubbleOrientation: (focusNode: Node, relatedNodes: Node[]) => any;
}

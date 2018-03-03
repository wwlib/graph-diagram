import Node from '../model/Node';
import Radius from '../layout/Radius';
import Bubble from './Bubble';
export default class NodeSpeechBubble extends Bubble {
    constructor(node: Node, radius: Radius);
    static chooseNodeSpeechBubbleOrientation: (focusNode: Node, relatedNodes: Node[]) => any;
}

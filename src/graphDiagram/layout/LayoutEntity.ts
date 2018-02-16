import GraphDiagram from '../GraphDiagram';
import Entity from '../model/Entity';
import NodeSpeechBubble from '../bubble/NodeSpeechBubble';
import Radius from '../bubble/Radius';

export default class LayoutEntity {

    public propertiesBubble: any;
    public model: Entity;

    constructor(entity: Entity) {
        this.model = entity;
        this.propertiesBubble = {};
    }
}

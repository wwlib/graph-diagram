import Relationship from '../model/Relationship';
import Bubble from './Bubble';
export default class RelationshipSpeechBubble extends Bubble {
    constructor(relationship: Relationship, apex: any);
    static chooseRelationshipSpeechBubbleOrientation(relationship: Relationship): any;
}

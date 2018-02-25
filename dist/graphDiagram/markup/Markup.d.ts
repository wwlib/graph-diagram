import Model from '../model/Model';
import Node from '../model/Node';
import Relationship from '../model/Relationship';
export default class Markup {
    static parseAll(selection: any): any[];
    static parseProperties(entity: Node | Relationship, debug?: boolean): () => void;
    static parse(selection: any, modelId?: string): Model;
    static format(model: Model, container: any): void;
}

import Model from '../model/Model';

export default class layoutModel {

    public graphModel: Model;
    public nodes: any [];
    public relationships: any[];
    public relationshipGroups: any[];

    constructor(model: Model) {
        this.graphModel = model;
        this.nodes = [];
        this.relationships = [];
        this.relationshipGroups = [];
    }
}

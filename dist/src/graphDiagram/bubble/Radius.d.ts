import Model from '../model/Model';
export default class Radius {
    insideRadius: number;
    borderWidth: number;
    arrowMargin: number;
    constructor(model: Model, insideRadius: number);
    inside(insideRadius: number): number | this;
    border: number;
    margin: number;
    mid(): number;
    outside(): number;
    startRelationship(): number;
    endRelationship(): number;
}

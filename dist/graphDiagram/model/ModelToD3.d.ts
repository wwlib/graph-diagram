import { Model } from '../..';
import { DataTypes, d3Graph } from "./DataTypes";
export default class ModelToD3 {
    dataTypes: DataTypes;
    static convert(model: Model): d3Graph;
    static parseD3(data: any, modelId?: string, origin?: {
        x: number;
        y: number;
    }): Model;
}

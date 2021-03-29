import { Model } from '../..';
import { DataTypes, d3Types } from "./DataTypes";
export default class ModelToD3 {
    dataTypes: DataTypes;
    static convert(model: Model): d3Types.d3Graph;
    static parseD3(data: any, modelId?: string, origin?: {
        x: number;
        y: number;
    }): Model;
    static mergeD3(data1: any, data2: any): any;
}

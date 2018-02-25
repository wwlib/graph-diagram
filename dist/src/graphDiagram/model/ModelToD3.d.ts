import { Model } from '../..';
import { d3Types } from "../d3/d3Types";
export default class ModelToD3 {
    static convert(model: Model): d3Types.d3Graph;
    static parseD3(data: any, modelId?: string, origin?: {
        x: number;
        y: number;
    }): Model;
}

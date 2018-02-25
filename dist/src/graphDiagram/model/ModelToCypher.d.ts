import Model from './Model';
import Entity from './Entity';
export default class ModelToCypher {
    static convert(model: Model): any;
    static props(element: Entity): {};
    static isIdentifier(name: string): boolean;
    static quote(name: string): string;
    static render(props: any): string;
}

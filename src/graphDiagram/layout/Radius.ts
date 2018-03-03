import Model from '../model/Model';

export default class Radius {

    public insideRadius: number;
    public borderWidth: number;
    public arrowMargin: number;

    constructor(model: Model, insideRadius: number) {
        this.insideRadius = insideRadius;
        this.borderWidth = model.parameters.nodeStrokeWidth;
        this.arrowMargin = model.parameters.nodeStartMargin;
    }

    inside(insideRadius: number) {
        if (arguments.length == 1)
        {
            this.insideRadius = insideRadius;
            return this;
        }
        return this.insideRadius;
    };

    get border(): number {
        return this.borderWidth;
    }

    set border(borderWidth: number) {
        this.borderWidth = borderWidth;
    };

    get margin(): number {
        return this.arrowMargin;
    }

    set margin(arrowMargin: number) {
        this.arrowMargin = arrowMargin;
    };

    mid(): number {
        return this.insideRadius + this.borderWidth / 2;
    };

    outside(): number {
        return this.insideRadius + this.borderWidth;
    };

    startRelationship(): number {
        return this.insideRadius + this.borderWidth + this.arrowMargin;
    };

    endRelationship(): number {
        return this.insideRadius + this.borderWidth + this.arrowMargin;
    };
};

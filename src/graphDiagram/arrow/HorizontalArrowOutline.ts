export default class HorizontalArrowOutline {

    public shaftRadius: number;
    public headRadius: number;
    public headLength: number;
    public shoulder: number;

    public outline: any;
    public apex: any;

    constructor(start: number, end: number, arrowWidth: number) {

        this.shaftRadius = arrowWidth / 2;
        this.headRadius = arrowWidth * 2;
        this.headLength = this.headRadius * 2;
        this.shoulder = start < end ? end - this.headLength : end + this.headLength;

        this.outline = [
            "M", start, this.shaftRadius,
            "L", this.shoulder, this.shaftRadius,
            "L", this.shoulder, this.headRadius,
            "L", end, 0,
            "L", this.shoulder, -this.headRadius,
            "L", this.shoulder, -this.shaftRadius,
            "L", start, -this.shaftRadius,
            "Z"
        ].join(" ");

        this.apex = {
            x: start + (this.shoulder - start) / 2,
            y: 0
        };
    }
}

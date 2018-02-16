export default class CurvedArrowOutline
{
    public startAttach: any;
    public endAttach: any;
    public offsetAngle: number;

    public startRadius: number;
    public endRadius: number;
    public endCentre: number;
    public minOffset: number;
    public arrowWidth: number;
    public headWidth: number;
    public headLength: number;

    public radiusRatio: number;
    public homotheticCenter: number;

    public shaftRadius: number;
    public headRadius: number;

    public g1: number;
    public c1: number;
    public g2: number;
    public c2: number;
    public cx: number;
    public cy: number;
    public arcRadius: number;

    public outline: any;
    public apex: any;

    constructor(startRadius: number, endRadius: number, endCentre: number, minOffset: number, arrowWidth: number, headWidth: number, headLength: number) {
        this.startRadius=startRadius;
        this.endRadius=endRadius;
        this.endCentre=endCentre;
        this.minOffset=minOffset;
        this.arrowWidth=arrowWidth;
        this.headWidth=headWidth;
        this.headLength=headLength;

        this.radiusRatio = startRadius / (endRadius + headLength);
        this.homotheticCenter = -endCentre * this.radiusRatio / (1 - this.radiusRatio);

        if(endRadius + headLength > startRadius)
        {
            this.offsetAngle = minOffset / startRadius;
            this.startAttach = {
                x: Math.cos( this.offsetAngle ) * (startRadius),
                y: Math.sin( this.offsetAngle ) * (startRadius)
            };
            this.endAttach = this.intersectWithOtherCircle( this.startAttach, endRadius + headLength, endCentre, -1 );
        }
        else
        {
            this.offsetAngle = minOffset / endRadius;
            this.endAttach = {
                x: endCentre - Math.cos( this.offsetAngle ) * (endRadius + headLength),
                y: Math.sin( this.offsetAngle ) * (endRadius + headLength)
            };
            this.startAttach = this.intersectWithOtherCircle( this.endAttach, startRadius, 0, 1 );
        }

        this.g1 = -this.startAttach.x / this.startAttach.y,
        this.c1 = this.startAttach.y + (this.square( this.startAttach.x ) / this.startAttach.y),
        this.g2 = -(this.endAttach.x - this.endCentre) / this.endAttach.y,
        this.c2 = this.endAttach.y + (this.endAttach.x - this.endCentre) * this.endAttach.x / this.endAttach.y;

        this.cx = ( this.c1 - this.c2 ) / (this.g2 - this.g1);
        this.cy = this.g1 * this.cx + this.c1;

        this.arcRadius = Math.sqrt(this.square(this.cx - this.startAttach.x) + this.square(this.cy - this.startAttach.y));

        this.shaftRadius = this.arrowWidth / 2;
        this.headRadius = this.headWidth / 2;

        this.outline = [
            "M", this.startTangent(-this.shaftRadius),
            "L", this.startTangent(this.shaftRadius),
            "A", this.arcRadius - this.shaftRadius, this.arcRadius - this.shaftRadius, 0, 0, minOffset > 0 ? 0 : 1, this.endTangent(-this.shaftRadius),
            "L", this.endTangent(-this.headRadius),
            "L", this.endNormal(headLength),
            "L", this.endTangent(this.headRadius),
            "L", this.endTangent(this.shaftRadius),
            "A", this.arcRadius + this.shaftRadius, this.arcRadius + this.shaftRadius, 0, 0, minOffset < 0 ? 0 : 1, this.startTangent(-this.shaftRadius)
        ].join( " " );

        this.apex = {
            x: this.cx,
            y: this.cy > 0 ? this.cy - this.arcRadius : this.cy + this.arcRadius
        }
    }

    square( l: number )
    {
        return l * l;
    }


    intersectWithOtherCircle(fixedPoint: any, radius: number, xCenter: number, polarity: number)
    {
        var gradient = fixedPoint.y / (fixedPoint.x - this.homotheticCenter);
        var hc = fixedPoint.y - gradient * fixedPoint.x;

        var A = 1 + this.square(gradient);
        var B = 2 * (gradient * hc - xCenter);
        var C = this.square(hc) + this.square(xCenter) - this.square(radius);

        var intersection: any = { x: (-B + polarity * Math.sqrt( this.square( B ) - 4 * A * C )) / (2 * A) };
        intersection.y = (intersection.x - this.homotheticCenter) * gradient;

        return intersection;
    }

    startTangent(dr: number)
    {
        var dx = (dr < 0 ? -1 : 1) * Math.sqrt(this.square(dr) / (1 + this.square(this.g1)));
        var dy = this.g1 * dx;
        return [
            this.startAttach.x + dx,
            this.startAttach.y + dy
        ].join(",");
    }

    endTangent(dr: number)
    {
        var dx = (dr < 0 ? -1 : 1) * Math.sqrt(this.square(dr) / (1 + this.square(this.g2)));
        var dy = this.g2 * dx;
        return [
            this.endAttach.x + dx,
            this.endAttach.y + dy
        ].join(",");
    }

    endNormal(dc: number)
    {
        var dx = (dc < 0 ? -1 : 1) * Math.sqrt(this.square(dc) / (1 + this.square(1 / this.g2)));
        var dy = dx / this.g2;
        return [
            this.endAttach.x + dx,
            this.endAttach.y - dy
        ].join(",");
    }

}

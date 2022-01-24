import {polyPoint} from "./shape";

function easeInExpo(x) {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

export class ApproxShape  {
    data = {};

    animatingOut=false

    constructor(p5, mouthApprox) {
        this.data = mouthApprox || {};
        const d = this.data;
        let points = d.svgShape.getPoints()[0]

        let resolvedPoints = [];
        this.data.resolvedPoints=resolvedPoints;
        let n = this.data.numberPoints || 5000

        const randTriangle = () => {
            const a1 = p5.sb.random(0, p5.TWO_PI)
            const a2 = p5.sb.random(0, p5.TWO_PI)
            const a3 = p5.sb.random(0, p5.TWO_PI)
            return [p5.cos(a1), p5.sin(a1), p5.cos(a2), p5.sin(a2), p5.cos(a3), p5.sin(a3)].map(p => p * d.pointSize)
        }

        let resolvedTriangles = [];
        d.resolvedTriangles=resolvedTriangles

        for (let i = 0; i < n; i++) {
            const p = {
                x: p5.sb.random(d.svgShape.boundingBox.l, d.svgShape.boundingBox.r),
                y: p5.sb.random(d.svgShape.boundingBox.t, d.svgShape.boundingBox.b)
            }
            const coll = polyPoint(points,
                p.x, p.y)
            if (coll) {
                resolvedPoints.push(p.x,p.y)
            }
            resolvedTriangles.push(randTriangle())
        }


    }

    debugDisplayMouth() {
        p5.push()
        p5.translate(this.data.position.x, this.data.position.y)
        p5.fill(240, 100, 100)
        p5.stroke(0, 100, 100)
        p5.beginShape();
        for (let point of this.data.points) {
            p5.vertex(point.x, point.y)
        }
        p5.endShape();
        p5.pop()
    }

    startAnimatingOut() {
        this.animatingOut=true
        this.animPositions = [].concat(this.data.resolvedPoints)
        const n = this.animPositions.length
        this.animTimeOffsets = [];
        const top = this.data.svgShape.boundingBox.t
        const bottom = this.data.svgShape.boundingBox.b
        for (let i = 0; i < n; i+=2) {
            this.animTimeOffsets.push((Math.abs(top)+this.animPositions[i+1])/(bottom-top)*2)
        }
        console.log();
    }


    render(p5, animateTime) {

        p5.push()
        p5.translate(this.data.position.x, this.data.position.y)
        const d = this.data
        p5.fill(240, 100, 100)
        // p5.stroke(255, 100, 100)
        // p5.noStroke()
        p5.stroke(d.colorScheme.color)
        p5.strokeWeight(2)
        p5.fill(d.colorScheme.color)

        let points = d.resolvedPoints
        let tris = d.resolvedTriangles
        if(this.animatingOut){
            const n = this.animPositions.length
            for (let i = 0; i < n; i+=2) {
                const offset = this.animTimeOffsets[Math.floor(i/2)];
                if(animateTime>=offset && animateTime < offset+1.0){
                    this.animPositions[i] = d.resolvedPoints[i] + easeInExpo(animateTime-offset) * p5.width
                }
            }

            points =  this.animPositions
        }


        for (let i = 0; i < points.length; i+=2) {
            p5.push()
            p5.translate(points[i], points[i+1])
            // p5.triangle(...tris[Math.floor(i/2)])
            p5.point(0,0)
            p5.pop()
        }




        p5.pop()
    }
}

class Shape {
    constructor(pos, collisionShapesArray) {
        this.pos = pos;
        this.collisionShapesArray = collisionShapesArray;
    }

    setCollisionShapes(collisionShapesArray) {
        this.collisionShapesArray = collisionShapesArray;
    }


    collisionShapes() {
        if (!this.collisionShapesArray) {
            throw new Error("collisionShapesArray is not defined");
        }
        return this.collisionShapesArray;
    }

    colliding(p5, otherShape) {
        const shapesAC = this.collisionShapes()
        const shapesBC = otherShape.collisionShapes()
        let d = p5.createVector(0, 0);
        for (let i = 0; i < shapesAC.length; i++) {
            for (let j = 0; j < shapesBC.length; j++) {
                d.x = shapesBC[j].x- shapesAC[i].x;
                d.y = shapesBC[j].y- shapesAC[i].y;
                if (d.magSq() < shapesAC[i].r2 + shapesBC[j].r2) {
                    return [shapesAC[i], shapesBC[j]];
                }
            }
        }
        return false;
    }
}


export class Circle extends Shape {
    constructor(p5, pos, radius, weight, singleCollisionShape) {
        super(pos, []);
        this.radius = radius;
        this.weight = weight;

        if(singleCollisionShape){
            const r =(radius+weight)*1.4;
            this.collisionShapesArray.push({x:pos.x, y:pos.y, r, r2 :Math.pow(r,2)});
        } else {
            let collisionSize = this.weight * 1.4;
            let circumfrence = p5.TWO_PI * this.radius;
            let numCircles = Math.floor(circumfrence / collisionSize);
            let x = 0;
            let y = 0;
            for (let i = 0; i < numCircles; i++) {
                let angle = i * p5.TWO_PI / numCircles;
                x = this.pos.x + this.radius * Math.cos(angle);
                y = this.pos.y + this.radius * Math.sin(angle);
                this.collisionShapesArray.push({x: x, y: y, r: collisionSize, r2: collisionSize*collisionSize})
            }
        }
    }

    draw(p5, color) {
        p5.strokeWeight(this.weight);
        p5.noFill()
        if(color){
            p5.stroke(color);
        } else {
            p5.stroke(255, 0, 0);
        }
        p5.ellipse(this.pos.x, this.pos.y, this.radius * 2);

        if(p5.debugEnabled){
            p5.strokeWeight(1.0);
            p5.noFill();


            for (let s of this.collisionShapesArray) {
                p5.ellipse(s.x,s.y, s.r*2.0);
            }
        }
    }
}

export const seaGen = (p5, num) => {
    const N = num||1000;
    const shapes = [];

    const generateCircle = (radius)=>{
        let x = p5.sb.random(p5.width);
        let y = p5.sb.random(p5.height);
        let r = radius || p5.sb.random();
        let weight = 0;
        let singleCollisionShape = false;
        if(!radius) {
            if (r < .5) {
                singleCollisionShape = true
                r = p5.sb.random(p5.width * .005, p5.width * .015);
            } else if (r < .75) {
                r = p5.sb.random(p5.width * .03, p5.width * .05);
            } else if (r < .99) {
                r = p5.sb.random(p5.width * .06, p5.width * .09);
            } else {
                r = p5.sb.random(p5.width * .5, p5.width * .7);
            }
        }
        weight = Math.max(r*.1,1.0);

        return new Circle(p5, p5.createVector(x, y), r, weight, singleCollisionShape);
    }

     shapes.push( generateCircle( p5.sb.random(p5.width * .5, p5.width * .7)))
    for (let i = 0; i < N; i++) {

        const s = generateCircle()
        let good = true;
        for (let other of shapes) {
            if (s.colliding(p5, other)) {
                i--;
                good = false
                break;
            }
        }
        if (good) {
            shapes.push(s);
        }
    }
    return shapes
}

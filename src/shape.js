const re = /[LMZ]/

const parsePoints = (svg) =>
    svg.split(re)
        .filter(p => !!p)
        .map(p => p.split(','))
        .map(pair => ({
            x: parseFloat(pair[0]),
            y: parseFloat(pair[1])
        }))


const parseMultiPartShape = (svgs, scale) => {
    let l = Number.MAX_SAFE_INTEGER
    let r = Number.MIN_SAFE_INTEGER;
    let t = Number.MAX_SAFE_INTEGER;
    let b = Number.MIN_SAFE_INTEGER;

    const pointsArray = svgs.map(parsePoints)
    const pointsFlat = pointsArray.flat()
    //center

    // bounding box around centered shape
    for (let point of pointsFlat) {
        if (point.x < l) l = point.x
        if (point.x > r) r = point.x
        if (point.y < t) t = point.y
        if (point.y > b) b = point.y
    }

    const width = r - l;
    const height = b - t
    const aspect = Math.max(width, height)
    const wAspect = width / aspect;
    const hAspect = height / aspect;

    const out = []
    for (let points of pointsArray) {
        for (const point of points) {
            point.x = ((point.x - l) / aspect - .5 * wAspect) * scale
            point.y = ((point.y - t) / aspect - .5 * hAspect) * scale
        }
        out.push({
            points,
            center: {x: 0, y: 0},
            width: scale * wAspect,
            height: scale * hAspect,
            boundingBox: {
                l: -.5 * wAspect * scale,
                r: .5 * wAspect * scale,
                t: -.5 * hAspect * scale,
                b: .5 * hAspect * scale
            }
        })
    }

    return out
}

export class VectorShape {
    constructor(points, center, boundingBox, multipart) {
        this.points = points
        this.center = center
        this.boundingBox = boundingBox
        this.multipart = !!multipart
    }

    static create(p5, svgPath, scale) {
        if (typeof svgPath === 'string') {
            const {points, center, boundingBox} = parseMultiPartShape(svgPath, scale)[0]
            return new VectorShape(points, p5.createVector(center.x, center.y), boundingBox, false)
        } else {
            //multi part object
            const vals = parseMultiPartShape(svgPath, scale)
            return new VectorShape(vals.map(v => v.points), p5.createVector(vals[0].center.x, vals[0].center.y), vals[0].boundingBox, true)
        }
    }

    // {x,y}[]
    getPoints() {
        return this.points
    }

    // if multipart then getPoints returns array of array of points
    isMultiPart() {
        return this.multipart
    }

    // {x,y}
    getCenter() {
        return this.center
    }

    // {t, r, b, l}
    getBoundingBox() {
        return this.boundingBox
    }
}


//vertices are {x,y}[]
//https://editor.p5js.org/slow_izzm/sketches/gh_U2jZyu
export function polyPoint(vertices, px, py) {
    let collision = false;

    // go through each of the vertices, plus
    // the next vertex in the list
    let next = 0;
    for (let current = 0; current < vertices.length; current++) {

        // get next vertex in list
        // if we've hit the end, wrap around to 0
        next = current + 1;
        if (next == vertices.length) next = 0;

        // get the Vectors at our current position
        // this makes our if statement a little cleaner
        let vc = vertices[current]; // c for "current"
        let vn = vertices[next]; // n for "next"

        // compare position, flip 'collision' variable
        // back and forth
        if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
            (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
            collision = !collision;
        }
    }
    return collision;
}

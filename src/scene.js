const objectTypes = {
    [0]: undefined,
    [1]: 'circle',
    [2]: 'square',
}
export const createScene = (p5, colorScheme, gridSize) => {


    const grid = [];
    const bdColor = colorScheme.tertiary({saturation: .2})
    for (let x = 0; x < gridSize; x++) {
        grid.push([])
        for (let y = 0; y < gridSize; y++) {
            grid[x].push({shape: 2, color: bdColor})
        }
    }


    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            if (p5.sb.random() < .1) {
                const size = p5.sb.randomInt(1, 5)
                const color = colorScheme.continuousStepped(x * y + y, {brightness: (p5.sb.random() + .25) + .75});
                // grid[x][y] = {shape:2, color}
                for (let xi = 0; xi < size; xi++) {
                    for (let yi = 0; yi < size; yi++) {
                        if (xi + x < gridSize && yi + y < gridSize) {
                            grid[xi + x][yi + y] = {shape: 2, color}
                        }
                    }
                }
            }
        }
    }


    return {grid, width: gridSize, height: gridSize};
}


export const summarize = (p5, scene, px, py, resolution, viewport) => {

    // const startFolding = px + visibleDistance
    // if (startFolding > scene.width) {
    //     //return the unfolded grid to the end
    //     return;
    // }
    let debug=false

    let visible = .3;
    let folded = .7;

    let visibleDistance = Math.floor(viewport.w * visible * (1-px/(scene.width - viewport.w)))
    let foldedWidth = Math.floor(viewport.w * folded * (1-px/(scene.width - viewport.w)))
    const halfW = Math.floor(viewport.w * .5)
    const halfH = Math.floor(viewport.h * .5)

    let ct=0
    const sx = foldedWidth + px + halfW
    let numSegments = foldedWidth;
    for (let i = 0; i < numSegments; i++) {
        // ((scene.width - sx )/numSegments*(i+1)) * Math.pow((i+1)/numSegments, 4)
        // const foldFrom = Math.floor((scene.width - sx )* Math.pow((i)/numSegments, 2) + sx)
        const foldTo = Math.floor((scene.width - sx) * Math.pow((i + 1) / numSegments, 2) + sx)

        // scale down foldFrom to foldViewFrom
        for (let y = 0; y < viewport.h; y++) {
            //last shape
            const x = foldTo - 1;
            const shape = scene.grid[x][y + py]
            // p5.push()
            if(!debug)
                p5.noStroke();
            p5.fill(shape.color);
            p5.rect(resolution.x * (viewport.w-foldedWidth + i+1), resolution.x * (y), resolution.x, resolution.y);
            // p5.pop()
            ct++
        }

    }

     visibleDistance = Math.floor(viewport.w * visible * (px/(scene.width)))
     foldedWidth = Math.floor(viewport.w * folded* (px/(scene.width)))
    const ssx = foldedWidth + px
     numSegments = foldedWidth;
    for (let i = 0; i < numSegments; i++) {
        // ((scene.width - sx )/numSegments*(i+1)) * Math.pow((i+1)/numSegments, 4)
        const foldFrom = (px+foldedWidth)-Math.floor((ssx )* Math.pow((i)/numSegments, 2))

        // const foldFrom = Math.floor(ssx - (scene.width - ssx) * Math.pow((i + 1) / numSegments, 2))
        // const foldTo = Math.floor(ssx - (scene.width - ssx) * Math.pow((i) / numSegments, 2))
        // const foldTo = Math.floor((scene.width - ssx )* Math.pow(1-(i)/numSegments, 2)  + sx)

        // scale down foldFrom to foldViewFrom
        for (let y = 0; y < viewport.h; y++) {
            //last shape
            const x = foldFrom;
            const shape = scene.grid[x][y + py]
            // p5.push()
            if(!debug)
                p5.noStroke();
            p5.fill(shape.color);
            p5.rect(resolution.x * (numSegments-i-1), resolution.y * (y), resolution.x, resolution.y);
            // p5.pop()
            ct++;
        }

    }
    // console.log("draw calls ",ct)

}


export const drawScene = (p5, scene, px, py, resolution, viewport) => {
    p5.noStroke()
    for (let x = 0; x < scene.width; x++) {
        for (let y = 0; y < scene.height; y++) {
            if (x < px || x > px + viewport.w || y < py || y > py + viewport.h) {
                continue;
            }
            const shape = scene.grid[x][y].shape;
            // p5.push()
            // p5.noStroke()
            if (shape === 1) {
                p5.fill(scene.grid[x][y].color);
                p5.ellipse(resolution.x * (x), resolution.x * (y), resolution.y);
            }
            if (shape === 2) {
                p5.fill(scene.grid[x][y].color);
                p5.rect(resolution.x * (x - px), resolution.y * (y - py), resolution.x, resolution.y);
            }
            // p5.pop()

        }
    }
    const t0 = performance.now();
    summarize(p5, scene, px, py, resolution, viewport)
    const t1 = performance.now();
    // console.log(`summarize took ${t1 - t0} milliseconds.`);
}

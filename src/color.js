const colorWithModifies = (p5, opts, color) => {
    const s = opts.saturation ? opts.saturation * color[1] : color[1];
    const b = opts.brightness ? opts.brightness * color[2] : color[2];

    return p5.color(color[0], s, b, opts.alpha || color[3]);
}

export class ColorScheme {

    constructor(p5) {
        this.p5 = p5;
        this._primary = [
            p5.sb.random(360),
            p5.sb.random(25) + 75,
            p5.sb.random(50) + 50,
            1];
        this._secondary = [(this._primary[0] + 30) % 360, p5.sb.random(25)+75, p5.sb.random(70)+ 30, 1]
        this._tertiary = [(this._secondary[0] + 90) % 360, p5.sb.random(50)+50, p5.sb.random(50)+50, 1]
        this._trinary = [(this._primary[0] + 60) % 360, p5.sb.random(50)+50, 50+p5.sb.random(50), 1]
    }

    primary(opts = {}) {
        return colorWithModifies(this.p5, opts, this._primary)
    }

    secondary(opts = {}) {
        return colorWithModifies(this.p5, opts, this._secondary)
    }

    tertiary(opts={}) {
        return colorWithModifies(this.p5, opts, this._tertiary)
    }

    trinary(opts={}) {
        return colorWithModifies(this.p5, opts, this._trinary)
    }

    continuousStepped(i,opts={}) {
        return colorWithModifies(this.p5, opts, [this._primary, this._secondary, this._tertiary][i % 3])
    }

}

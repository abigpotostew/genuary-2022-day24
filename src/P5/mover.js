import p5 from 'p5';
import P5 from 'p5';

// Gravitational Attraction
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/EpgB3cNhKPM
// https://thecodingtrain.com/learning/nature-of-code/2.5-gravitational-attraction.html
// https://editor.p5js.org/codingtrain/sketches/MkLraatd

export class Mover {
  constructor(p5, x, y, m, c, r) {
    this.pos = p5.createVector(x, y);
    this.vel = p5.createVector();//P5.Vector.random2D();
    this.vel.mult(5);
    this.acc = p5.createVector(0, 0);
    this.mass = m;
    this.r = r || p5.sqrt(this.mass) * 20;
    this.color = c
  }

  applyForce(force) {
    let f = P5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  update(p5) {
    this.vel.add(this.acc);
    this.vel.mult(.98)
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show(p5) {
    p5.stroke(this.color );
    p5.strokeWeight(2);
    p5.fill(this.color );
    p5.ellipse(this.pos.x, this.pos.y, this.r);
  }
}

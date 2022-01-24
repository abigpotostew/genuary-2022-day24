import p5 from 'p5';
import P5 from 'p5';

// Gravitational Attraction
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/EpgB3cNhKPM
// https://thecodingtrain.com/learning/nature-of-code/2.5-gravitational-attraction.html
// https://editor.p5js.org/codingtrain/sketches/MkLraatd

export class Attractor {
  constructor(p5, x, y, m) {
    this.pos = p5.createVector(x, y);
    this.mass = m;
    this.r = p5.sqrt(this.mass) * 2;
  }

  attract(p5, mover) {
    let force = P5.Vector.sub(this.pos, mover.pos);
    let distanceSq = p5.constrain(force.magSq(), 100, 1000);
    let G = 20;
    // if(distanceSq >  2500  ) {

      let strength = (G * (this.mass * mover.mass)) / distanceSq;
      force.setMag(strength);
      mover.applyForce(force);
    // }
  }

  show(p5) {
    // p5.noStroke();
    // p5.fill(255, 0, 100);
    // p5.ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}

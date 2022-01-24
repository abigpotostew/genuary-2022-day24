import p5 from 'p5';
import {PRNGRand} from "./random";
import {seaGen} from "./sea";


let chunks = []
var recorder;
const pixelDens = 1;
const sketch = p5 => {

    let colorScheme;
    let colorsArrayMap = new Map()
    let acceleration = 0;
    let velocity = 0
    let globalLineWidth = 30;

    let radius = 0.5;
    let colorFlipAllowed = false;

    const frate = 30 // frame rate
    const numFrames = 100 // num of frames to record
    let recording = false


    let keysDown = {}

    let castlesXML;

    let animateTime = 0; //0..1

    let shapes = [];

    p5.preload = () => {
        // castlesXML = p5.loadXML('./castles.svg');
    }
    p5.setup = () => {
        const canv = p5.createCanvas(800, 800);
        canv.parent('sketch')
        p5.pixelDensity(pixelDens)
        // p5.colorMode(p5.HSB)
        p5.sb = new PRNGRand(new Date().getMilliseconds())
        // colorScheme = new ColorScheme(p5)
        p5.noSmooth();
        p5.frameRate(24)
        p5.debugEnabled = false


        shapes = seaGen(p5, 1000)
    }

    p5.mouseReleased = () => {
        shapes = seaGen(p5, 500)
        p5.loop()
    }

    p5.keyPressed = () => {
        if (p5.key === 'r') {
            recording = !recording
            if (recording) {
                record()
            } else {
                exportVideo()
            }
        }

        if (p5.key === 's') {
            p5.saveCanvas('sketch-d6', 'png')
        }

        keysDown[p5.keyCode] = true
    }

    p5.keyReleased = () => {

        keysDown[p5.keyCode] = false

        if (p5.key === 'd') {
            p5.debugEnabled = !p5.debugEnabled
        }
    }

    p5.draw = () => {


        p5.push()
        p5.background(10, 15, 39)


        // const ms = new Circle(p5, p5.createVector(p5.mouseX, p5.mouseY), p5.width *.04, p5.width *.04 *.1)
        // ms.draw(p5);
        p5.noiseDetail(1, 0.3);
        let blues = [p5.color(20, 30, 100), p5.color(20, 30, 120), p5.color(20, 20, 100), p5.color(20, 35, 100), p5.color(35, 20, 110), p5.color(35, 20, 210)]
        let green = p5.color(10, p5.random(60,100), 10);
        for (let shape of shapes) {
            const scalar = .01
            let n = p5.noise(shape.pos.x * scalar, shape.pos.y * scalar)
            let color;
            if (n > .5) {
                //white ocean spray
                color = p5.color(160, 160, 200)

            } else if (n > .35) {
                // color = p5.color(10, 70, 10)
                color=p5.color(10, p5.random(60,100), 10);
            } else if (n > .32) {
                color = p5.color(190, 160, 160)
            } else {
                color = blues[p5.floor(p5.random(0, blues.length))]
            }
            shape.draw(p5, color)
            // let colliding=shape.colliding(p5, ms)
            // if(colliding){
            //     p5.stroke(0,0,255)
            //     p5.ellipse(colliding[0].x,colliding[0].y,5)
            //     p5.ellipse(colliding[1].x,colliding[1].y,5)
            // }
        }


        p5.noFill()
        p5.stroke(0);
        p5.strokeWeight(p5.width * .09)
        p5.rect(0, 0, p5.width, p5.height)
        p5.pop()

        p5.noLoop();

    }
    // var recorder=null;
    const record = () => {
        chunks.length = 0;
        let stream = document.querySelector('canvas').captureStream(30)
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            if (e.data.size) {
                chunks.push(e.data);
            }
        };
        recorder.start();

    }

    const exportVideo = (e) => {
        recorder.stop();

        setTimeout(() => {
            var blob = new Blob(chunks);
            var vid = document.createElement('video');
            vid.id = 'recorded'
            vid.controls = true;
            vid.src = URL.createObjectURL(blob);
            document.body.appendChild(vid);
            vid.play();
        }, 1000)
    }
}


new p5(sketch);

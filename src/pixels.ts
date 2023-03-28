import p5 from "p5"

// Credit to:
// https://happycoding.io/tutorials/p5js/creating-classes/isometric-cubes
const sketch = (s: any) => {
    // ==== Config Start ====

    const baseWidth = 700;
    const baseHeight = 700;

    const maxPos = 9
    const sideLength = 32
    const cubesCount = 256

    const fps = 10

    const backgroundColor = {
        r: 17,
        g: 17,
        b: 27,
    }

    const linesColor = {
        r: 28,
        g: 28,
        b: 28,

        weight: 2,
    }

    const baseColor = {
        r: 17,
        g: 255,
        b: 96,

        low: -0.5,
        high: 0.6,
    }

    // ==== Config End ====

    let gridTopX: number
    let gridTopY: number

    const cubes: Cube[] = []

    s.setup = () => {
        s.createCanvas(baseWidth, 700)
        s.frameRate(fps)

        s.stroke(linesColor.r, linesColor.b, linesColor.g)
        s.strokeWeight(linesColor.weight)

        cubes.push(new Cube(0, 0, 0))

        while (cubes.length < cubesCount) {
            addRandomCube()
        }

        sortCubes()
    }

    s.draw = () => {
        s.background(backgroundColor.r, backgroundColor.g, backgroundColor.b)

        gridTopX = s.width / 2
        gridTopY = s.height / 2

        for (const cube of cubes) {
            cube.draw()
        }

        const ix = s.random(cubes.length)
        cubes.splice(ix, 1)
        addRandomCube()
        sortCubes()
    }

    s.windowResized = () => {
        s.resizeCanvas(s.min(s.windowWidth, baseWidth), baseHeight);
    }

    function addRandomCube() {
        while (true) {
            const randomCube = s.random(cubes)

            let newCubeC = randomCube.c
            let newCubeR = randomCube.r
            let newCubeZ = randomCube.z

            const r = s.random(1)
            if (r < 0.3) {
                newCubeC++
            } else if (r < 0.6) {
                newCubeR++
            } else {
                newCubeZ++
            }

            const spotTaken = cubes.some((cube) => {
                return cube.c == newCubeC &&
                    cube.r == newCubeR &&
                    cube.z == newCubeZ
            })

            if (!spotTaken &&
                newCubeC <= maxPos &&
                newCubeR <= maxPos &&
                newCubeZ <= maxPos) {
                cubes.push(new Cube(newCubeC, newCubeR, newCubeZ))
                break
            }
        }
    }

    function sortCubes() {
        cubes.sort((a, b) => {
            return a.getSortString().localeCompare(b.getSortString())
        })
    }

    class Cube {
        public readonly c: number
        public readonly r: number
        public readonly z: number

        private readonly red: number
        private readonly green: number
        private readonly blue: number

        constructor(c: number, r: number, z: number) {
            this.c = c
            this.r = r
            this.z = z

            const noiseScale = 0.4
            this.red = s.map(s.noise(c * noiseScale, r * noiseScale, z * noiseScale),
                0, 1, baseColor.low, baseColor.high) * 255 + baseColor.r
            this.green = s.map(s.noise(c * noiseScale, r * noiseScale, z * noiseScale),
                0, 1, baseColor.low, baseColor.high) * 255 + baseColor.g
            this.blue = s.map(s.noise(c * noiseScale, r * noiseScale, z * noiseScale),
                0, 1, baseColor.low, baseColor.high) * 255 + baseColor.b
        }

        draw() {
            const x = gridTopX + (this.c - this.r) * sideLength * s.sqrt(3) / 2
            const y = gridTopY + (this.c + this.r) * sideLength / 2 - (sideLength * this.z)

            const points = []
            for (let angle = s.PI / 6; angle < s.PI * 2; angle += s.PI / 3) {
                points.push(s.createVector(x + s.cos(angle) * sideLength, y + s.sin(angle) * sideLength))
            }

            s.fill(this.red * 0.75, this.green * 0.75, this.blue * 0.75)
            s.quad(x, y,
                points[5].x, points[5].y,
                points[0].x, points[0].y,
                points[1].x, points[1].y)

            s.fill(this.red * 0.9, this.green * 0.9, this.blue * 0.9)
            s.quad(x, y,
                points[1].x, points[1].y,
                points[2].x, points[2].y,
                points[3].x, points[3].y)

            s.fill(this.red, this.green, this.blue)
            s.quad(x, y,
                points[3].x, points[3].y,
                points[4].x, points[4].y,
                points[5].x, points[5].y)
        }

        getSortString(): string {
            return this.z + "." + this.r + "." + this.c
        }
    }
}

export default function newPixelsSketch(canvasDiv: HTMLElement) {
    new p5(sketch, canvasDiv)
}

import { Color, Matrix, Point } from "mini-draw"
import { Collider } from "./components/Collider"
import { IsPlayer } from "./components/IsPlayer"
import { Position } from "./components/Position"
import { RenderColor } from "./components/RenderColor"
import { Size } from "./components/Size"
import { Speed } from "./components/Speed"
import { Dispatcher } from "./ecs/Dispatcher"
import { GameView } from "./GameView"
import { NaiveDispatcher } from "./NaiveDispatcher"
import "./style.scss"
import { CameraSystem } from "./systems/CameraSystem"
import { PhysicsSystem } from "./systems/PhysicsSystem"
import { PlayerInputSystem } from "./systems/PlayerInputSystem"
import { RenderSystem } from "./systems/RenderSystem"

const gameView = new GameView()
const dispatcher: Dispatcher = new NaiveDispatcher()

dispatcher.createEntity([
    new Position(Point.zero),
    new Size(Point.one),
    new RenderColor(Color.yellow),
    new IsPlayer(),
    new Speed(15),
    new Collider("dynamic"),
])

const arenaSize = 20
const wallThickness = 1
for (const [position, size] of [
    [new Point(0, arenaSize * 0.5), new Point(arenaSize, wallThickness)],
    [new Point(0, -arenaSize * 0.5), new Point(arenaSize, wallThickness)],
    [new Point(arenaSize * 0.5, 0), new Point(wallThickness, arenaSize)],
    [new Point(-arenaSize * 0.5, 0), new Point(wallThickness, arenaSize)],
]) {
    dispatcher.createEntity([
        new Position(position),
        new Size(size),
        new RenderColor(Color.white.mul(0.3).lerp(Color.magenta, 0.02)),
        new Collider("static"),
    ])
}

dispatcher.registerSystem(new CameraSystem(gameView))
dispatcher.registerSystem(new PlayerInputSystem(gameView))
dispatcher.registerSystem(new RenderSystem(gameView))
dispatcher.registerSystem(new PhysicsSystem())

let lastFrame = performance.now()
setInterval(() => {
    const now = performance.now()
    const deltaTime = (now - lastFrame) / 1000
    lastFrame = now

    gameView.drawer
        .setNativeSize()
        .overrideTransform(Matrix.identity)
        .setStyle(Color.white.mul(0.5).lerp(Color.green, 0.01))
        .fillRect()

    dispatcher.update(deltaTime)
}, 17)

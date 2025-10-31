import { Color, Matrix, Point } from "mini-draw"
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
])

dispatcher.createEntity([
    new Position(new Point(10, 10)),
    new Size(new Point(5, 5)),
    new RenderColor(Color.red),
])

dispatcher.registerSystem(new CameraSystem(gameView))
dispatcher.registerSystem(new PlayerInputSystem(gameView))
dispatcher.registerSystem(new RenderSystem(gameView))

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

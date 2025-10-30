import { Color, Matrix, Point, Rect } from "mini-draw"
import { Renderer } from "./Renderer"
import "./style.scss"

const renderer = new Renderer()

let playerPosition = Point.zero

setInterval(() => {
    const { drawer, camera } = renderer

    drawer
        .setNativeSize()
        .overrideTransform(Matrix.identity)
        .setStyle(Color.white.mul(0.5).lerp(Color.green, 0.01))
        .fillRect()

    camera.updateViewport(drawer)
    camera.overrideTransform(drawer)

    drawer.setStyle(Color.red).fillRect(Rect.extends(new Point(10, 10), new Point(5, 5)))
    drawer.setStyle(Color.yellow).fillRect(Rect.extends(playerPosition, Point.one))

    if (renderer.isPressed("KeyA")) playerPosition = playerPosition.add(-0.2, 0)
    if (renderer.isPressed("KeyD")) playerPosition = playerPosition.add(0.2, 0)
    if (renderer.isPressed("KeyW")) playerPosition = playerPosition.add(0, -0.2)
    if (renderer.isPressed("KeyS")) playerPosition = playerPosition.add(0, 0.2)

    renderer.camera.offset = playerPosition.mul(-camera.scale)
}, 17)

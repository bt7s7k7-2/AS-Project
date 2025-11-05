import { Drawer, Point } from "mini-draw"

export class GameView {
    public readonly canvas = document.createElement("canvas")
    public readonly drawer = new Drawer(this.canvas.getContext("2d")!)
    public readonly camera = new Drawer.Camera({
        scale: 25,
        shouldCenterView: true,
    })

    public mousePosition = Point.zero
    public mousePressed = false


    protected _keys = new Map<string, boolean>()
    public isPressed(key: string) {
        return this._keys.get(key) ?? false
    }

    constructor() {
        document.body.appendChild(this.canvas)

        window.addEventListener("keydown", (event) => {
            this._keys.set(event.code, true)
        })

        window.addEventListener("keyup", (event) => {
            this._keys.set(event.code, false)
        })

        window.addEventListener("mousemove", (event) => {
            this.mousePosition = new Point(event)
        })

        window.addEventListener("mousedown", (event) => {
            if (event.button == 0) this.mousePressed = true
        })

        window.addEventListener("mouseup", (event) => {
            if (event.button == 0) this.mousePressed = false
        })
    }
}

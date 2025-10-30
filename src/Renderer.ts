import { Drawer } from "mini-draw"

export class Renderer {
    public readonly canvas = document.createElement("canvas")
    public readonly drawer = new Drawer(this.canvas.getContext("2d")!)
    public readonly camera = new Drawer.Camera({
        scale: 25,
        shouldCenterView: true,
    })


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
    }
}

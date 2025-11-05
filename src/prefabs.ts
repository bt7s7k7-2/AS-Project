import { Color, Point } from "mini-draw"
import { Collider } from "./components/Collider"
import { IsBullet } from "./components/IsBullet"
import { Position } from "./components/Position"
import { RenderColor } from "./components/RenderColor"
import { Size } from "./components/Size"
import { Velocity } from "./components/Velocity"

export function makeBullet(position: Point, vector: Point, color: Color, force: number, damage: number) {
    return [
        new Position(position),
        new Size(Point.one.mul(0.2)),
        new RenderColor(color),
        new Collider("trigger"),
        new IsBullet(force, damage),
        new Velocity(vector),
    ]
}

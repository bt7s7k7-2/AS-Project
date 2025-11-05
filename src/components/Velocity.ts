import { Point } from "mini-draw"
import { Component } from "../ecs/Component"

export class Velocity extends Component {
    public static override readonly type: string = "velocity"

    constructor(
        public value = Point.zero,
    ) { super() }
}

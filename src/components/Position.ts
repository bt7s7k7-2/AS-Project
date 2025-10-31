import { Point } from "mini-draw"
import { Component } from "../ecs/Component"

export class Position extends Component {
    public static override readonly type = "position"

    constructor(
        public value: Point,
    ) { super() }
}

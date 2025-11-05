import { Point } from "mini-draw"
import { Component } from "../ecs/Component"

export class Position extends Component {
    public static override readonly type = "position"

    public translate(offset: Point) {
        this.value = this.value.add(offset)
    }

    constructor(
        public value: Point,
    ) { super() }
}

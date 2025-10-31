import { Point } from "mini-draw"
import { Component } from "../ecs/Component"

export class Size extends Component {
    public static override readonly type = "size"

    constructor(
        public value: Point,
    ) { super() }
}

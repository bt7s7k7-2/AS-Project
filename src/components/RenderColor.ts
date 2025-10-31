import { Color } from "mini-draw"
import { Component } from "../ecs/Component"

export class RenderColor extends Component {
    public static override readonly type = "renderColor"

    constructor(
        public value: Color,
    ) { super() }
}

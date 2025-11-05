import { Point } from "mini-draw"
import { Component } from "../ecs/Component"

export class PlayerMovementEvent extends Component {
    public static override readonly type: string = "playerMovementEvent"

    constructor(
        public readonly position: Point,
    ) { super() }
}

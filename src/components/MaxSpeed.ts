import { Component } from "../ecs/Component"

export class MaxSpeed extends Component {
    public static override readonly type = "maxSpeed"

    constructor(
        public value: number,
    ) { super() }
}

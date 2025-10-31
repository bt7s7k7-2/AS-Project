import { Component } from "../ecs/Component"

export class Speed extends Component {
    public static override readonly type = "speed"

    constructor(
        public value: number,
    ) { super() }
}

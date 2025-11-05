import { Component } from "../ecs/Component"

export class Health extends Component {
    public value = this.maxHealth

    constructor(
        public readonly maxHealth: number,
    ) { super() }
}

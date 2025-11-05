import { Component } from "../ecs/Component"

export class Health extends Component {
    public value = this.maxHealth

    public applyDamage(damage: number) {
        this.value = Math.max(0, this.value - damage)
    }

    constructor(
        public readonly maxHealth: number,
    ) { super() }
}

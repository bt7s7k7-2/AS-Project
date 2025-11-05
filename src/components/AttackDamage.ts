import { Component } from "../ecs/Component"

export class AttackDamage extends Component {
    public static override readonly type: string = "attackDamage"

    constructor(
        public readonly value: number,
    ) { super() }
}

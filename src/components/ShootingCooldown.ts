import { Component } from "../ecs/Component"

export class ShootingCooldown extends Component {
    public static override readonly type: string = "shootingSpeed"

    public cooldown = Math.random() * this.maxCooldown

    constructor(
        public readonly maxCooldown: number,
    ) { super() }
}

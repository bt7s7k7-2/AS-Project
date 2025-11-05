import { Component } from "../ecs/Component"

export class ShootingCooldown extends Component {
    public static override readonly type: string = "shootingSpeed"

    public cooldown = 0

    constructor(
        public readonly maxCooldown = 0,
    ) { super() }
}

import { Component } from "../ecs/Component"

export class IsBullet extends Component {
    public static override readonly type: string = "isBullet"

    constructor(
        public readonly force: number,
        public readonly damage: number,
    ) { super() }
}

import { Component } from "../ecs/Component"

export const FORCE_PLAYER = 0
export const FORCE_ENEMY = 1
export const FORCE_NEUTRAL = 2

export class Force extends Component {
    public static override readonly type: string = "force"

    constructor(
        public readonly value: number,
    ) { super() }
}

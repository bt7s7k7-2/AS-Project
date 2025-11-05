import { Point } from "mini-draw"
import { Component } from "../ecs/Component"

export const AI_STATE_KINDS = ["wander", "circle", "follow"] as const

export class AIState extends Component {
    public static override readonly type = "aiState"

    public kind: typeof AI_STATE_KINDS[number] = AI_STATE_KINDS[0]
    public timeout = 0
    public value = 1
    public target = Point.zero
}

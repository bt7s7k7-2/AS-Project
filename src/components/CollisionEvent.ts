import { Point } from "mini-draw"
import { Component } from "../ecs/Component"
import { Entity } from "../ecs/Entity"
import { Collider } from "./Collider"

export class CollisionEvent extends Component {
    public static override readonly type: string = "collisionEvent"

    constructor(
        public readonly entity: Entity,
        public readonly collider: Collider,
        public readonly resolution: Point,
    ) { super() }
}

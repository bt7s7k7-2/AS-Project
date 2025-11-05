import { Component } from "../ecs/Component"

export class Collider extends Component {
    public static override readonly type = "collider"

    constructor(
        public readonly kind: "dynamic" | "static",
    ) { super() }
}

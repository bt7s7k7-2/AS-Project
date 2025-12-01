import { Component } from "../ecs/Component"

export class EntityDiedEvent extends Component {
    public static readonly type: string = "EntityDiedEvent"
}

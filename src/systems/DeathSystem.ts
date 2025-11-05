import { Health } from "../components/Health"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"

export class DeathSystem extends System<[typeof Health]> {
    public override getPriority(): number {
        return 98
    }

    public override getRequiredComponents(): [typeof Health] {
        return [Health]
    }

    public override update(deltaTime: number, entities: Entity[], components: [Health][]): void {
        for (let i = 0; i < components.length; i++) {
            const [health] = components[i]

            if (health.value <= 0) {
                this._dispatcher.deleteEntity(entities[i])
            }
        }
    }
}

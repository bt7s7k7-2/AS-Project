import { Position } from "../components/Position"
import { Velocity } from "../components/Velocity"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"

export class VelocityMovementSystem extends System<[typeof Position, typeof Velocity]> {
    public override getPriority(): number {
        return 0
    }

    public override getRequiredComponents(): [typeof Position, typeof Velocity] {
        return [Position, Velocity]
    }

    public override update(deltaTime: number, entities: Entity[], components: [Position, Velocity][]): void {
        for (const [position, velocity] of components) {
            position.translate(velocity.value.mul(deltaTime))
        }
    }
}

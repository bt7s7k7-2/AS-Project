import { IsPlayer } from "../components/IsPlayer"
import { Position } from "../components/Position"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"

export class CameraSystem extends System<[typeof Position, typeof IsPlayer]> {
    public override getPriority(): number {
        return 99
    }

    public override getRequiredComponents(): [typeof Position, typeof IsPlayer] {
        return [Position, IsPlayer]
    }

    public override update(deltaTime: number, entities: Entity[], components: [Position, IsPlayer][]): void {
        const camera = this._dispatcher.game.camera
        for (const [position] of components) {
            camera.offset = position.value.mul(-camera.scale)
        }
    }
}

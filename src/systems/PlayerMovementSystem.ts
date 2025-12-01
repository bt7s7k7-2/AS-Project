import { Point } from "mini-draw"
import { IsPlayer } from "../components/IsPlayer"
import { MaxSpeed } from "../components/MaxSpeed"
import { PlayerMovementEvent } from "../components/PlayerMovementEvent"
import { Position } from "../components/Position"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"

export class PlayerMovementSystem extends System<[typeof Position, typeof MaxSpeed, typeof IsPlayer]> {
    public override getPriority(): number {
        return 0
    }

    public override getRequiredComponents(): [typeof Position, typeof MaxSpeed, typeof IsPlayer] {
        return [Position, MaxSpeed, IsPlayer]
    }

    public override update(deltaTime: number, entities: Entity[], components: [Position, MaxSpeed, IsPlayer][]): void {
        let movement = Point.zero
        const game = this._dispatcher.game

        if (game.isPressed("KeyA")) movement = movement.add(-1, 0)
        if (game.isPressed("KeyD")) movement = movement.add(1, 0)
        if (game.isPressed("KeyW")) movement = movement.add(0, -1)
        if (game.isPressed("KeyS")) movement = movement.add(0, 1)

        movement = movement.normalize().mul(deltaTime)

        for (let i = 0; i < components.length; i++) {
            const [position, speed] = components[i]
            const entity = entities[i]
            position.translate(movement.mul(speed.value))
            this._dispatcher.emitEvent(entity, new PlayerMovementEvent(position.value))
        }
    }
}

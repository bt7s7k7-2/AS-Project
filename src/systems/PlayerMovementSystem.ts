import { Point } from "mini-draw"
import { IsPlayer } from "../components/IsPlayer"
import { MaxSpeed } from "../components/MaxSpeed"
import { Position } from "../components/Position"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"
import { GameView } from "../GameView"

export class PlayerMovementSystem extends System<[typeof Position, typeof MaxSpeed, typeof IsPlayer]> {
    public override getPriority(): number {
        return 0
    }

    public override getRequiredComponents(): [typeof Position, typeof MaxSpeed, typeof IsPlayer] {
        return [Position, MaxSpeed, IsPlayer]
    }

    public override update(deltaTime: number, entities: Entity[], components: [Position, MaxSpeed, IsPlayer][]): void {
        let movement = Point.zero

        if (this._gameView.isPressed("KeyA")) movement = movement.add(-1, 0)
        if (this._gameView.isPressed("KeyD")) movement = movement.add(1, 0)
        if (this._gameView.isPressed("KeyW")) movement = movement.add(0, -1)
        if (this._gameView.isPressed("KeyS")) movement = movement.add(0, 1)

        movement = movement.normalize().mul(deltaTime)

        for (const [position, speed] of components) {
            position.value = position.value.add(movement.mul(speed.value))
        }
    }

    constructor(
        protected readonly _gameView: GameView,
    ) { super() }
}

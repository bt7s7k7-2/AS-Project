import { Point } from "mini-draw"
import { IsPlayer } from "../components/IsPlayer"
import { Position } from "../components/Position"
import { Speed } from "../components/Speed"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"
import { GameView } from "../GameView"

export class PlayerInputSystem extends System<[typeof Position, typeof Speed, typeof IsPlayer]> {
    public override getPriority(): number {
        return 0
    }

    public override getRequiredComponents(): [typeof Position, typeof Speed, typeof IsPlayer] {
        return [Position, Speed, IsPlayer]
    }

    public override update(deltaTime: number, entities: Entity[], components: [Position, Speed, IsPlayer][]): void {
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

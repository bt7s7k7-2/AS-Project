import { IsPlayer } from "../components/IsPlayer"
import { Position } from "../components/Position"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"
import { GameView } from "../GameView"

export class CameraSystem extends System<[typeof Position, typeof IsPlayer]> {
    public override getPriority(): number {
        return 1
    }

    public override getRequiredComponents(): [typeof Position, typeof IsPlayer] {
        return [Position, IsPlayer]
    }

    public override update(deltaTime: number, entities: Entity[], components: [Position, IsPlayer][]): void {
        for (const [position] of components) {
            this._gameView.camera.offset = position.value.mul(-this._gameView.camera.scale)
        }
    }

    constructor(
        protected readonly _gameView: GameView,
    ) { super() }
}

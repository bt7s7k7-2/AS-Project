import { Point } from "mini-draw"
import { AIState } from "../components/AIState"
import { MaxSpeed } from "../components/MaxSpeed"
import { PlayerMovementEvent } from "../components/PlayerMovementEvent"
import { Position } from "../components/Position"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"


export class EnemyBehaviourSystem extends System<[typeof Position, typeof AIState, typeof MaxSpeed]> {
    public override getPriority(): number {
        return 1
    }

    public override getRequiredComponents(): [typeof Position, typeof AIState, typeof MaxSpeed] {
        return [Position, AIState, MaxSpeed]
    }

    public override update(deltaTime: number, entities: Entity[], components: [Position, AIState, MaxSpeed][]): void {
        const playerPosition = this._dispatcher.pullEvents(PlayerMovementEvent).at(0)?.[1].position

        for (const [position, aiState, maxSpeed] of components) {
            aiState.timeout -= deltaTime
            if (aiState.timeout <= 0) {
                if (!playerPosition || Math.random() < 0.2) {
                    aiState.kind = "wander"
                    aiState.target = new Point(
                        (Math.random() * 2) - 1,
                        (Math.random() * 2) - 1,
                    ).normalize()
                } else if (Math.random() < 0.75) {
                    aiState.kind = "circle"
                    aiState.target = playerPosition!
                    aiState.value = Math.random() > 0.5 ? 1 : -1
                } else {
                    aiState.kind = "follow"
                    aiState.target = playerPosition!
                }

                aiState.timeout = 1 + Math.random() * 3
            }

            if (aiState.kind == "wander") {
                position.translate(aiState.target.mul(deltaTime * maxSpeed.value))
            } else {
                if (playerPosition) {
                    aiState.target = playerPosition
                }
                const vector = aiState.target.sub(position.value)

                if (aiState.kind == "circle") {
                    if (vector.size() < 2) aiState.timeout = 0
                    const tangent = vector.normalize().tangent().mul(aiState.value)
                    position.translate(tangent.mul(deltaTime * maxSpeed.value))
                } else if (aiState.kind == "follow") {
                    if (vector.size() < 5) aiState.timeout = 0
                    position.translate(vector.clampSize(deltaTime * maxSpeed.value))
                }
            }
        }
    }
}



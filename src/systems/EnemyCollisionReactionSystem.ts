import { AIState } from "../components/AIState"
import { CollisionEvent } from "../components/CollisionEvent"
import { Entity } from "../ecs/Entity"
import { EventHandler } from "../ecs/EventHandler"


export class EnemyCollisionReactionSystem extends EventHandler<typeof CollisionEvent> {
    public override getPriority(): number {
        return 15
    }

    public override getEventType(): typeof CollisionEvent {
        return CollisionEvent
    }

    public override handleEvents(events: [Entity, CollisionEvent][]): void {
        for (const [entity, collision] of events) {
            const aiState = this._dispatcher.tryGetComponent(entity, AIState)
            if (!aiState) continue

            aiState.timeout = 0
        }
    }

}

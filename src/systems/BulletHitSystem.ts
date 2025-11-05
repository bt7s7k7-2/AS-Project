import { CollisionEvent } from "../components/CollisionEvent"
import { IsBullet } from "../components/IsBullet"
import { Dispatcher } from "../ecs/Dispatcher"
import { Entity } from "../ecs/Entity"
import { EventHandler } from "../ecs/EventHandler"

export class BulletHitSystem extends EventHandler<typeof CollisionEvent> {
    public override getPriority(): number {
        return 2
    }

    public override getEventType(): typeof CollisionEvent {
        return CollisionEvent
    }

    public override handleEvents(events: [Entity, CollisionEvent][]): void {
        for (const [entity, collision] of events) {
            const isBullet = this._dispatcher.tryGetComponent(entity, IsBullet)
            if (!isBullet) continue

            if (collision.collider.kind == "static") {
                // If the bullet hits a wall, delete it
                this._dispatcher.deleteEntity(entity)
            }
        }
    }

    constructor(
        protected readonly _dispatcher: Dispatcher,
    ) { super() }

}

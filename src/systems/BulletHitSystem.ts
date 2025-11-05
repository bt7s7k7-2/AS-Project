import { CollisionEvent } from "../components/CollisionEvent"
import { Force } from "../components/Force"
import { Health } from "../components/Health"
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
            const bullet = this._dispatcher.tryGetComponent(entity, IsBullet)
            // Only handle bullets
            if (!bullet) continue

            const force = this._dispatcher.tryGetComponent(collision.entity, Force)
            if (force && force.value != bullet.force) {
                // If the bullet hit an enemy, apply damage if it has health and delete the bullet
                const health = this._dispatcher.tryGetComponent(collision.entity, Health)

                if (health) {
                    health.value -= bullet.damage
                }

                this._dispatcher.deleteEntity(entity)
                continue
            }

            if (collision.collider.kind == "static") {
                // If the bullet hits a wall, delete the bullet
                this._dispatcher.deleteEntity(entity)
            }
        }
    }

    constructor(
        protected readonly _dispatcher: Dispatcher,
    ) { super() }

}

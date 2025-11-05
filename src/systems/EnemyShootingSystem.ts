import { Color } from "mini-draw"
import { AIState } from "../components/AIState"
import { AttackDamage } from "../components/AttackDamage"
import { FORCE_ENEMY } from "../components/Force"
import { PlayerMovementEvent } from "../components/PlayerMovementEvent"
import { Position } from "../components/Position"
import { ShootingCooldown } from "../components/ShootingCooldown"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"
import { makeBullet } from "../prefabs"

export class EnemyShootingSystem extends System<[typeof Position, typeof AIState, typeof ShootingCooldown, typeof AttackDamage]> {
    public override getPriority(): number {
        return 1
    }

    public override getRequiredComponents(): [typeof Position, typeof AIState, typeof ShootingCooldown, typeof AttackDamage] {
        return [Position, AIState, ShootingCooldown, AttackDamage]
    }

    public override update(deltaTime: number, entities: Entity[], components: [Position, AIState, ShootingCooldown, AttackDamage][]): void {
        const playerPosition = this._dispatcher.pullEvents(PlayerMovementEvent).at(0)?.[1].position
        if (!playerPosition) return

        for (const [position, aiState, shootingCooldown, attackDamage] of components) {
            if (shootingCooldown.cooldown > 0) {
                shootingCooldown.cooldown -= deltaTime
                continue
            }

            const vector = playerPosition.sub(position.value).normalize()

            this._dispatcher.createEntity(
                makeBullet(position.value, vector.mul(10), Color.orange, FORCE_ENEMY, attackDamage.value),
            )

            shootingCooldown.cooldown = shootingCooldown.maxCooldown
        }
    }

}

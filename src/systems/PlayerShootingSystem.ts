import { Color } from "mini-draw"
import { AttackDamage } from "../components/AttackDamage"
import { FORCE_PLAYER } from "../components/Force"
import { IsPlayer } from "../components/IsPlayer"
import { Position } from "../components/Position"
import { ShootingCooldown } from "../components/ShootingCooldown"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"
import { makeBullet } from "../prefabs"

export class PlayerShootingSystem extends System<[typeof Position, typeof ShootingCooldown, typeof AttackDamage, typeof IsPlayer]> {
    public getPriority(): number {
        return 0
    }

    public getRequiredComponents(): [typeof Position, typeof ShootingCooldown, typeof AttackDamage, typeof IsPlayer] {
        return [Position, ShootingCooldown, AttackDamage, IsPlayer]
    }

    public update(deltaTime: number, entities: Entity[], components: [Position, ShootingCooldown, AttackDamage, IsPlayer][]): void {
        const { camera, mousePosition, mousePressed } = this._dispatcher.gameView
        if (!mousePressed) return
        const target = camera.screenToWorld.transform(mousePosition)

        for (const [position, shootingCooldown, attackDamage] of components) {
            if (shootingCooldown.cooldown > 0) {
                shootingCooldown.cooldown -= deltaTime
                continue
            }

            const vector = target.sub(position.value).normalize()

            this._dispatcher.createEntity(
                makeBullet(position.value, vector.mul(50), Color.cyan, FORCE_PLAYER, attackDamage.value),
            )

            shootingCooldown.cooldown = shootingCooldown.maxCooldown
        }
    }
}

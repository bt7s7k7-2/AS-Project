import { Color, Point } from "mini-draw"
import { AttackDamage } from "../components/AttackDamage"
import { Collider } from "../components/Collider"
import { FORCE_PLAYER } from "../components/Force"
import { IsBullet } from "../components/IsBullet"
import { IsPlayer } from "../components/IsPlayer"
import { Position } from "../components/Position"
import { RenderColor } from "../components/RenderColor"
import { ShootingCooldown } from "../components/ShootingCooldown"
import { Size } from "../components/Size"
import { Velocity } from "../components/Velocity"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"

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
            this._dispatcher.createEntity([
                new Position(position.value),
                new Size(Point.one.mul(0.1)),
                new RenderColor(Color.white),
                new Collider("dynamic"),
                new IsBullet(FORCE_PLAYER, attackDamage.value),
                new Velocity(vector.mul(20)),
            ])

            shootingCooldown.cooldown = shootingCooldown.maxCooldown
        }
    }
}

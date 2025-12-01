import { Color, Point, Rect } from "mini-draw"
import { Health } from "../components/Health"
import { Position } from "../components/Position"
import { Size } from "../components/Size"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"

const _HEALTH_BAR_SIZE = new Point(20, 3)

export class HealthBarRenderSystem extends System<[typeof Position, typeof Size, typeof Health]> {
    public override getPriority(): number {
        return 101
    }

    public override getRequiredComponents(): [typeof Position, typeof Size, typeof Health] {
        return [Position, Size, Health]
    }

    public override update(deltaTime: number, entities: Entity[], components: [Position, Size, Health][]): void {
        const { camera, drawer } = this._dispatcher.game

        for (const [position, size, health] of components) {
            const anchor = camera.worldToScreen.transform(position.value.add(0, size.value.y * 0.5))
            const rect = Rect.extends(anchor.add(0, 5), _HEALTH_BAR_SIZE)
            drawer
                .setStyle(Color.red)
                .fillRect(rect.floor())
                .setStyle(Color.green)
                .fillRect(rect.with("width", rect.width * (health.value / health.maxHealth)).floor())
        }
    }
}

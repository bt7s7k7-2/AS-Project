import { Matrix, Rect } from "mini-draw"
import { Position } from "../components/Position"
import { RenderColor } from "../components/RenderColor"
import { Size } from "../components/Size"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"

export class RenderSystem extends System<[typeof Position, typeof Size, typeof RenderColor]> {
    public override getPriority(): number {
        return 100
    }

    public override getRequiredComponents(): [typeof Position, typeof Size, typeof RenderColor] {
        return [Position, Size, RenderColor]
    }

    public override update(deltaTime: number, entities: Entity[], components: [Position, Size, RenderColor][]): void {
        const { camera, drawer } = this._dispatcher.game

        camera.updateViewport(drawer)
        camera.overrideTransform(drawer)

        for (const [position, size, renderColor] of components) {
            drawer
                .setStyle(renderColor.value)
                .fillRect(Rect.extends(position.value, size.value))
        }

        drawer.overrideTransform(Matrix.identity)
    }
}

import { Matrix, Rect } from "mini-draw"
import { Position } from "../components/Position"
import { RenderColor } from "../components/RenderColor"
import { Size } from "../components/Size"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"
import { GameView } from "../GameView"

export class RenderSystem extends System<[typeof Position, typeof Size, typeof RenderColor]> {
    public override getPriority(): number {
        return 100
    }

    public override getRequiredComponents(): [typeof Position, typeof Size, typeof RenderColor] {
        return [Position, Size, RenderColor]
    }

    public override update(deltaTime: number, entities: Entity[], components: [Position, Size, RenderColor][]): void {
        this._gameView.camera.updateViewport(this._gameView.drawer)
        this._gameView.camera.overrideTransform(this._gameView.drawer)

        for (const [position, size, renderColor] of components) {
            this._gameView.drawer
                .setStyle(renderColor.value)
                .fillRect(Rect.extends(position.value, size.value))
        }

        this._gameView.drawer.overrideTransform(Matrix.identity)
    }

    constructor(
        protected readonly _gameView: GameView,
    ) { super() }
}

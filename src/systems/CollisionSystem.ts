import { Point, Rect } from "mini-draw"
import { Collider } from "../components/Collider"
import { CollisionEvent } from "../components/CollisionEvent"
import { Position } from "../components/Position"
import { Size } from "../components/Size"
import { Dispatcher } from "../ecs/Dispatcher"
import { Entity } from "../ecs/Entity"
import { System } from "../ecs/System"

function _resolveAabbIntersection(a: BoundingBox, b: BoundingBox) {
    const moveLeft = a.x2 - b.x1
    const moveRight = b.x2 - a.x1
    const moveUp = a.y2 - b.y1
    const moveDown = b.y2 - a.y1

    const minimumDisplacement = Math.min(moveLeft, moveRight, moveDown, moveUp)
    if (minimumDisplacement < 0) {
        return Point.zero
    }

    if (minimumDisplacement == moveLeft) return new Point(-moveLeft, 0)
    if (minimumDisplacement == moveRight) return new Point(moveRight, 0)
    if (minimumDisplacement == moveUp) return new Point(0, -moveUp)
    if (minimumDisplacement == moveDown) return new Point(0, moveDown)

    throw new Error("Invalid state for resolving AABB intersection")
}

export class BoundingBox {
    public translate(offset: Point) {
        this.x1 += offset.x
        this.y1 += offset.y
        this.x2 += offset.x
        this.y2 += offset.y
    }

    public toRect() {
        return new Rect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1)
    }

    constructor(
        public x1: number,
        public y1: number,
        public x2: number,
        public y2: number,
    ) { }

    public static fromEntity(position: Point, size: Point) {
        return new BoundingBox(position.x - size.x * 0.5, position.y - size.y * 0.5, position.x + size.x * 0.5, position.y + size.y * 0.5)
    }
}

export class CollisionSystem extends System<[typeof Position, typeof Size, typeof Collider]> {
    public getPriority(): number {
        return 1
    }

    public getRequiredComponents(): [typeof Position, typeof Size, typeof Collider] {
        return [Position, Size, Collider]
    }

    public update(deltaTime: number, entities: Entity[], components: [Position, Size, Collider][]): void {
        const boundingBoxes: BoundingBox[] = new Array(components.length)
        const staticColliders: number[] = []
        const dynamicColliders: number[] = []
        const triggerColliders: number[] = []

        for (let i = 0; i < components.length; i++) {
            const [position, size, collider] = components[i]
            boundingBoxes[i] = BoundingBox.fromEntity(position.value, size.value)
            if (collider.kind == "static") staticColliders.push(i)
            if (collider.kind == "dynamic") dynamicColliders.push(i)
            if (collider.kind == "trigger") triggerColliders.push(i)
        }

        for (const i of dynamicColliders) {
            const entity = entities[i]
            const [position] = components[i]
            const body = boundingBoxes[i]

            for (const j of staticColliders) {
                const collider = boundingBoxes[j]
                const resolution = _resolveAabbIntersection(body, collider)
                if (resolution.isZero()) continue

                position.value = position.value.add(resolution)
                body.translate(resolution)
                this._dispatcher.emitEvent(entity, new CollisionEvent(entities[j], components[j][2], resolution))
            }
        }

        const allCollidersExceptTriggers = [...staticColliders, ...dynamicColliders]

        for (const i of triggerColliders) {
            const entity = entities[i]
            const body = boundingBoxes[i]

            for (const j of allCollidersExceptTriggers) {
                const collider = boundingBoxes[j]
                const resolution = _resolveAabbIntersection(body, collider)
                if (resolution.isZero()) continue

                this._dispatcher.emitEvent(entity, new CollisionEvent(entities[j], components[j][2], resolution))
            }
        }
    }

    constructor(
        protected readonly _dispatcher: Dispatcher,
    ) { super() }
}

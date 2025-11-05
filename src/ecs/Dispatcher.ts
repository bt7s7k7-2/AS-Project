import { GameView } from "../GameView"
import { Component, ComponentType } from "./Component"
import { Entity } from "./Entity"
import { EventHandler } from "./EventHandler"
import { System } from "./System"

export abstract class Dispatcher<TEntity extends Entity = Entity> {
    public abstract createEntity(components: Component[]): TEntity
    public abstract deleteEntity(entity: TEntity): void
    public abstract registerSystem(system: new (dispatcher: Dispatcher) => (System | EventHandler)): void
    public abstract update(deltaTime: number): void
    public abstract tryGetComponent<T>(entity: TEntity, type: ComponentType<T>): T | null
    public abstract emitEvent(entity: TEntity, event: Component): void
    public abstract pullEvents<T extends ComponentType>(event: T): readonly [TEntity, InstanceType<T>][]

    constructor(
        public readonly gameView: GameView,
    ) { }
}



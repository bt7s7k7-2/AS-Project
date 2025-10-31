import { Component } from "./Component"
import { Entity } from "./Entity"
import { System } from "./System"

export abstract class Dispatcher<TEntity extends Entity = Entity> {
    public abstract createEntity(components: Component[]): TEntity
    public abstract deleteEntity(entity: TEntity): void
    public abstract registerSystem(system: System): void
    public abstract update(deltaTime: number): void
}



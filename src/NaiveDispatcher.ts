import { Component, ComponentType } from "./ecs/Component"
import { Dispatcher } from "./ecs/Dispatcher"
import { Entity } from "./ecs/Entity"
import { System } from "./ecs/System"

export class NaiveDispatcherEntity {
    public readonly components = new Map<ComponentType, Component>()
}

export interface NaiveDispatcherEntity extends Entity { }

export class NaiveDispatcher extends Dispatcher<NaiveDispatcherEntity> {
    protected readonly _entities: NaiveDispatcherEntity[] = []
    protected readonly _systems: System[] = []

    public createEntity(components: Component[]): NaiveDispatcherEntity {
        const entity = new NaiveDispatcherEntity()
        this._entities.push(entity)

        for (const component of components) {
            entity.components.set(component.getType(), component)
        }

        return entity
    }

    public deleteEntity(entity: NaiveDispatcherEntity): void {
        const index = this._entities.indexOf(entity)
        if (index == -1) throw new RangeError("Entity does not exist")
        this._entities.splice(index, 1)
    }

    public registerSystem(system: System): void {
        this._systems.push(system)
        this._systems.sort((a, b) => a.getPriority() - b.getPriority())
    }

    public update(deltaTime: number): void {
        for (const system of this._systems) {
            const requiredComponents = system.getRequiredComponents()
            const foundEntities: Entity[] = []
            const foundComponents: Component[][] = []

            entityLoop: for (const entity of this._entities) {
                const components: Component[] = []

                for (const requiredComponent of requiredComponents) {
                    const component = entity.components.get(requiredComponent)
                    if (component == null) continue entityLoop
                    components.push(component)
                }

                foundEntities.push(entity)
                foundComponents.push(components)
            }

            system.update(deltaTime, foundEntities, foundComponents)
        }
    }
}

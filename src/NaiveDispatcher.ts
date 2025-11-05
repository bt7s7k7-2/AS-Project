import { Component, ComponentType } from "./ecs/Component"
import { Dispatcher } from "./ecs/Dispatcher"
import { Entity } from "./ecs/Entity"
import { EventHandler } from "./ecs/EventHandler"
import { System } from "./ecs/System"

export class NaiveDispatcherEntity {
    public readonly components = new Map<ComponentType, Component>()
}

export interface NaiveDispatcherEntity extends Entity { }

export class NaiveDispatcher extends Dispatcher<NaiveDispatcherEntity> {
    protected readonly _entities: NaiveDispatcherEntity[] = []
    protected readonly _systemsAndHandlers: (System | EventHandler)[] = []
    protected readonly _pendingEvents = new Map<ComponentType, [Entity, Component][]>()

    public override createEntity(components: Component[]): NaiveDispatcherEntity {
        const entity = new NaiveDispatcherEntity()
        this._entities.push(entity)

        for (const component of components) {
            entity.components.set(component.getType(), component)
        }

        return entity
    }

    public override deleteEntity(entity: NaiveDispatcherEntity): void {
        const index = this._entities.indexOf(entity)
        if (index == -1) return
        this._entities.splice(index, 1)
    }

    public override registerSystem(system: System | EventHandler): void {
        this._systemsAndHandlers.push(system)
        this._systemsAndHandlers.sort((a, b) => a.getPriority() - b.getPriority())
    }

    public override tryGetComponent<T>(entity: NaiveDispatcherEntity, type: ComponentType<T>): T | null {
        // Type casts due to type erased .components map on Entity
        return (entity.components.get(type as ComponentType) ?? null) as T | null
    }

    public override emitEvent(entity: NaiveDispatcherEntity, event: Component): void {
        const type = event.getType()
        let list = this._pendingEvents.get(type)
        if (list == null) {
            this._pendingEvents.set(type, list = [])
        }

        list.push([entity, event])
    }

    public override update(deltaTime: number): void {
        for (const system of this._systemsAndHandlers) {
            if (system instanceof EventHandler) {
                const list = this._pendingEvents.get(system.getEventType())

                if (list && list.length > 0) {
                    system.handleEvents(list)
                }

                continue
            }

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

        this._pendingEvents.clear()
    }
}

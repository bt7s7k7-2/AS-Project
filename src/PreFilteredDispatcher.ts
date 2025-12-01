import { Component, ComponentType } from "./ecs/Component"
import { Dispatcher } from "./ecs/Dispatcher"
import { Entity } from "./ecs/Entity"
import { EventHandler } from "./ecs/EventHandler"
import { System } from "./ecs/System"

export class PreFilteredDispatcherEntity {
    public readonly components = new Map<ComponentType, Component>()
}

export interface PreFilteredDispatcherEntity extends Entity { }

function _getQueryId(requiredComponents: readonly ComponentType[]) {
    return requiredComponents.map(v => v.type).join(",")
}

export class SystemQuery {
    public readonly id = _getQueryId(this.requiredComponents)
    public readonly entities: PreFilteredDispatcherEntity[] = []
    public readonly components: Component[][] = []

    constructor(
        public readonly requiredComponents: readonly ComponentType[],
    ) { }
}

export class EventQuery {
    public readonly pending: [Entity, Component][] = []
}

export class SystemHandle {
    public update(deltaTime: number) {
        this.value.update(deltaTime, this.query.entities, this.query.components)
    }

    constructor(
        public readonly query: SystemQuery,
        public readonly value: System,
    ) { }
}

export class EventHandle {
    public update(deltaTime: number) {
        this.value.handleEvents(this.query.pending)
    }

    constructor(
        public readonly query: EventQuery,
        public readonly value: EventHandler,
    ) { }
}

export class PreFilteredDispatcher extends Dispatcher<PreFilteredDispatcherEntity> {
    protected readonly _handles: (SystemHandle | EventHandle)[] = []
    protected readonly _queries: SystemQuery[] = []
    protected readonly _eventQueries = new Map<ComponentType, EventQuery>()

    public createEntity(components: Component[]): PreFilteredDispatcherEntity {
        const entity = new PreFilteredDispatcherEntity()

        // Add components to entity
        for (const component of components) {
            entity.components.set(component.getType(), component)
        }

        // For every query...
        nextQuery: for (const query of this._queries) {
            const components: Component[] = []

            // ...test if entity has required components...
            for (const requiredComponent of query.requiredComponents) {
                const component = entity.components.get(requiredComponent)
                if (!component) continue nextQuery
                components.push(component)
            }

            // ...if so add it
            query.components.push(components)
            query.entities.push(entity)
        }

        return entity
    }

    public deleteEntity(entity: PreFilteredDispatcherEntity): void {
        // Search all queries, if they contain this entity, if so remove it
        for (const query of this._queries) {
            const index = query.entities.indexOf(entity)
            if (index == -1) continue
            query.entities.splice(index, 1)
            query.components.splice(index, 1)
        }
    }

    public registerSystem(factory: new (dispatcher: Dispatcher) => (System | EventHandler)): void {
        const instance = new factory(this)

        // If this is an event handler, simply get an event query for that event type
        if (instance instanceof EventHandler) {
            const eventType = instance.getEventType()
            let query = this._eventQueries.get(eventType)
            if (!query) this._eventQueries.set(eventType, query = new EventQuery())
            this._handles.push(new EventHandle(query, instance))
            this._handles.sort((a, b) => a.value.getPriority() - b.value.getPriority())
            return
        }

        const requiredComponents = instance.getRequiredComponents()
        const id = _getQueryId(requiredComponents)

        // Try to find a query with the same components
        for (const query of this._queries) {
            if (query.id != id) continue
            this._handles.push(new SystemHandle(query, instance))
            this._handles.sort((a, b) => a.value.getPriority() - b.value.getPriority())
            return
        }

        // If there isn't a query with the same components, create a new query
        const query = new SystemQuery(requiredComponents)
        this._queries.push(query)
        this._handles.push(new SystemHandle(query, instance))
        this._handles.sort((a, b) => a.value.getPriority() - b.value.getPriority())
        return
    }

    public update(deltaTime: number): void {
        // Update all systems and event handlers
        for (const handle of this._handles) {
            handle.update(deltaTime)
        }

        // Clear pending events
        for (const query of this._eventQueries.values()) {
            query.pending.length = 0
        }
    }

    public tryGetComponent<T>(entity: PreFilteredDispatcherEntity, type: ComponentType<T>): T | null {
        // Type casts due to type erased .components map on Entity
        return (entity.components.get(type as ComponentType) ?? null) as T | null
    }

    public override emitEvent(entity: PreFilteredDispatcherEntity, event: Component): void {
        const type = event.getType()
        let query = this._eventQueries.get(type)
        if (!query) this._eventQueries.set(type, query = new EventQuery())

        query.pending.push([entity, event])
    }

    public override pullEvents<T extends ComponentType>(event: T): readonly [PreFilteredDispatcherEntity, InstanceType<T>][] {
        // Type casts due to type erased component instances
        return this._eventQueries.get(event)?.pending as any ?? []
    }
}

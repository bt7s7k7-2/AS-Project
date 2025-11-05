import { ComponentType } from "./Component"
import { Entity } from "./Entity"

export abstract class EventHandler<TEventType extends ComponentType = ComponentType> {
    public abstract getPriority(): number
    public abstract getEventType(): TEventType
    public abstract handleEvents(events: [Entity, InstanceType<TEventType>][]): void
}

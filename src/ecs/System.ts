import { ComponentType } from "./Component"
import { Dispatcher } from "./Dispatcher"
import { Entity } from "./Entity"

export abstract class System<TComponentTypes extends readonly ComponentType[] = readonly ComponentType[]> {
    public abstract getPriority(): number
    public abstract getRequiredComponents(): TComponentTypes
    public abstract update(deltaTime: number, entities: Entity[], components: { [P in keyof TComponentTypes]: InstanceType<TComponentTypes[P]> }[]): void

    constructor(
        protected readonly _dispatcher: Dispatcher,
    ) { }
}

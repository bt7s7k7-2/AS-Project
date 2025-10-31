export type ComponentType<T = Component> = { readonly type: string, new(...args: any): T }

export abstract class Component {
    public getType() {
        return this.constructor as ComponentType<this>
    }

    public static readonly type: string
}

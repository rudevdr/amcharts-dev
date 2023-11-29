import { Entity, IEntityEvents, IEntitySettings, IEntityPrivate } from "../../core/util/Entity";
export interface ISerializerSettings extends IEntitySettings {
    /**
     * An array of settings to not include in the serialized data.
     */
    excludeSettings?: Array<string>;
    /**
     * An array of settings to include in the serialized data.
     */
    includeSettings?: Array<string>;
    /**
     * An array of properties to not include in the serialized data.
     *
     * @since 5.3.2
     */
    excludeProperties?: Array<string>;
    /**
     * An array of properties to include in the serialized data.
     *
     * @ignore
     * @todo implement
     */
    includeProperties?: Array<string>;
    /**
     * Maximum depth of recursion when traversing target object.
     *
     * @default 2
     */
    maxDepth?: number;
}
export interface ISerializerPrivate extends IEntityPrivate {
}
export interface ISerializerEvents extends IEntityEvents {
}
/**
 * Provides functionality to serialize charts or individual elements into simple
 * objects or JSON.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/serializing/} for more info
 * @since 5.3.0
 */
export declare class Serializer extends Entity {
    static className: string;
    static classNames: Array<string>;
    _settings: ISerializerSettings;
    _privateSettings: ISerializerPrivate;
    _events: ISerializerEvents;
    protected _refs: {
        [index: string]: any;
    };
    /**
     * Serializes target object into a simple object or JSON string.
     *
     * @param   source  Target object
     * @param   depth   Current depth
     * @param   full    Serialize object in full (ignoring maxDepth)
     * @return          Serialized data
     */
    serialize(source: unknown, depth?: number, full?: boolean): unknown;
}
//# sourceMappingURL=Serializer.d.ts.map
import type { Root } from "../../core/Root";
import { Entity } from "../../core/util/Entity";
import { Container } from "../../core/render/Container";
export interface IParseSettings {
    parent?: Container;
}
/**
 * A parser for JSON based chart configs.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/serializing/} for more info
 * @since 5.3.0
 */
export declare class JsonParser {
    protected _root: Root;
    /**
     * IMPORTANT! Do not instantiate this class via `new Class()` syntax.
     *
     * Use static method `Class.new()` instead.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
     * @ignore
     */
    constructor(root: Root, isReal: boolean);
    /**
     * Use this method to create an instance of this class.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
     * @param   root      Root element
     * @return            Instantiated object
     */
    static new<C extends typeof JsonParser, T extends InstanceType<C>>(this: C, root: Root): T;
    /**
     * Parses and creates chart objects from simple objects.
     *
     * @param   object  Serialized data
     * @return          A promise of a target object
     */
    parse<E extends Entity>(object: unknown, settings?: IParseSettings): Promise<E>;
    /**
     * Parses and creates chart objects from JSON string.
     *
     * @param   string  JSON string
     * @return          A promise of a target object
     */
    parseString<E extends Entity>(string: string, settings?: IParseSettings): Promise<E>;
}
//# sourceMappingURL=Json.d.ts.map
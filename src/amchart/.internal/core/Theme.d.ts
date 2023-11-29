import type { Entity } from "./util/Entity";
import { Template } from "./util/Template";
import type { Root } from "./Root";
import type { IClasses } from "./Classes";
export interface IRule<A extends Entity> {
    tags: Array<string>;
    template: Template<A>;
}
/**
 * A base class for an amCharts theme.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/themes/} for more info
 * @important
 */
export declare class Theme {
    protected _root: Root;
    /**
     * Use this method to create an instance of this class.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
     * @param   root      Root element
     * @param   settings  Settings
     * @param   template  Template
     * @return            Instantiated object
     */
    static new<T extends typeof Theme>(this: T, root: Root): InstanceType<T>;
    constructor(root: Root, isReal: boolean);
    protected setupDefaultRules(): void;
    protected _rules: {
        [type: string]: Array<IRule<Entity>>;
    };
    /**
     * Looks up the rules for a specific theme class.
     *
     * @see {@link https://www.amcharts.com/docs/v5/themes/} for more info
     * @param   themeClass Theme class
     * @return             Array<IRule<A>>
     */
    _lookupRules<A extends Entity>(themeClass: string): Array<IRule<A>> | undefined;
    /**
     * Creates a [[Template]] for specific theme class and tags.
     *
     * NOTE: the difference from `rule()` is that `ruleRaw()` does not do any
     * type checks.
     *
     * @see {@link https://www.amcharts.com/docs/v5/themes/} for more info
     * @param   themeClass Theme class
     * @param   themeTags  Theme tags
     * @return             Template
     */
    ruleRaw<A extends Entity>(themeClass: string, themeTags?: Array<string>): Template<A>;
    /**
     * Creates a [[Template]] for specific theme class and tags.
     *
     * @see {@link https://www.amcharts.com/docs/v5/themes/} for more info
     * @param   themeClass Theme class
     * @param   themeTags  Theme tags
     * @return             Template
     */
    rule<K extends keyof IClasses>(themeClass: K, themeTags?: Array<string>): Template<IClasses[K]>;
}
//# sourceMappingURL=Theme.d.ts.map
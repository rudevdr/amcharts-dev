/**
 * @ignore
 */
export declare class Registry {
    /**
     * Currently running version of amCharts.
     */
    readonly version: string;
    /**
     * List of applied licenses.
     * @ignore
     */
    licenses: String[];
    /**
     * Entities that have their `id` setting set.
     */
    entitiesById: {
        [index: string]: any;
    };
    /**
     * All created [[Root]] elements.
     */
    rootElements: any[];
}
/**
    * @ignore
 */
export declare const registry: Registry;
/**
 * Adds a license, e.g.:
 *
 * ```TypeScript
 * am5.addLicense("xxxxxxxx");
 * ```
 * ```JavaScript
 * am5.addLicense("xxxxxxxx");
 * ```
 *
 * Multiple licenses can be added to cover for multiple products.
 *
 * @param  license  License key
 */
export declare function addLicense(license: string): void;
/**
 * Disposes all [[Root]] elements.
 */
export declare function disposeAllRootElements(): void;
//# sourceMappingURL=Registry.d.ts.map
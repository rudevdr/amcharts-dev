/**
 * @ignore
 */
export class Registry {
    constructor() {
        /**
         * Currently running version of amCharts.
         */
        Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "5.6.1"
        });
        /**
         * List of applied licenses.
         * @ignore
         */
        Object.defineProperty(this, "licenses", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        /**
         * Entities that have their `id` setting set.
         */
        Object.defineProperty(this, "entitiesById", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        /**
         * All created [[Root]] elements.
         */
        Object.defineProperty(this, "rootElements", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
}
/**
    * @ignore
 */
export const registry = new Registry();
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
export function addLicense(license) {
    registry.licenses.push(license);
}
/**
 * Disposes all [[Root]] elements.
 */
export function disposeAllRootElements() {
    let root;
    while (root = registry.rootElements.pop()) {
        root.dispose();
    }
}
//# sourceMappingURL=Registry.js.map
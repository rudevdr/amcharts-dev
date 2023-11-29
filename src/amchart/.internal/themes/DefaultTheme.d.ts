import type { InterfaceColors, IInterfaceColorsSettings } from "../core/util/InterfaceColors";
import { Theme } from "../core/Theme";
interface Settable<A> {
    _settings: A;
    set<K extends keyof A>(key: K, value: A[K]): void;
}
/**
 * @ignore
 */
export declare function setColor<A, K extends keyof A>(rule: Settable<A>, key: K, ic: InterfaceColors, name: keyof IInterfaceColorsSettings): void;
/**
 * @ignore
 */
export declare class DefaultTheme extends Theme {
    protected setupDefaultRules(): void;
}
export {};
//# sourceMappingURL=DefaultTheme.d.ts.map
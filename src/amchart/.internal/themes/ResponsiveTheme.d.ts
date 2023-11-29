import { Theme } from "../core/Theme";
import type { Root } from "../core/Root";
import { MultiDisposer } from "../core/util/Disposer";
import type { Template } from "../core/util/Template";
/**
 * An interface describing resonsive rule.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/responsive/} for more info
 * @important
 */
export interface IResponsiveRule {
    /**
     * A class name of the elements to apply rule to.
     */
    name?: string;
    /**
     * A class group of the elements to apply rule to.
     */
    tags?: string | string[];
    /**
     * Settings to apply when activating the responsive rule.
     */
    settings?: any;
    /**
     * A callback function which should check and return `true` if rule is
     * applicable for current situation.
     */
    relevant: (width: number, height: number) => boolean;
    /**
     * A custom callback function which is called when applying the rule.
     */
    applying?: () => void;
    /**
     * A custom callback function which is called when removing the rule.
     */
    removing?: () => void;
    /**
     * Indicates if rule is currently applied.
     * @readonly
     */
    applied?: boolean;
    /**
     * Reference to [[Template]] object associated with the rule.
     * @readonly
     */
    template?: Template<any>;
    /**
     * @ignore
     */
    _dp?: MultiDisposer;
}
/**
 * A configurable theme that dynamically adapts chart settings for best fit
 * in available space.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/responsive/} for more info
 */
export declare class ResponsiveTheme extends Theme {
    static XXS: number;
    static XS: number;
    static S: number;
    static M: number;
    static L: number;
    static XL: number;
    static XXL: number;
    static widthXXS(width: number, _height: number): boolean;
    static widthXS(width: number, _height: number): boolean;
    static widthS(width: number, _height: number): boolean;
    static widthM(width: number, _height: number): boolean;
    static widthL(width: number, _height: number): boolean;
    static widthXL(width: number, _height: number): boolean;
    static widthXXL(width: number, _height: number): boolean;
    static heightXXS(_width: number, height: number): boolean;
    static heightXS(_width: number, height: number): boolean;
    static heightS(_width: number, height: number): boolean;
    static heightM(_width: number, height: number): boolean;
    static heightL(_width: number, height: number): boolean;
    static heightXL(_width: number, height: number): boolean;
    static heightXXL(_width: number, height: number): boolean;
    static isXXS(width: number, height: number): boolean;
    static isXS(width: number, height: number): boolean;
    static isS(width: number, height: number): boolean;
    static isM(width: number, height: number): boolean;
    static isL(width: number, height: number): boolean;
    static isXL(width: number, height: number): boolean;
    static isXXL(width: number, height: number): boolean;
    static maybeXXS(width: number, height: number): boolean;
    static maybeXS(width: number, height: number): boolean;
    static maybeS(width: number, height: number): boolean;
    static maybeM(width: number, height: number): boolean;
    static maybeL(width: number, height: number): boolean;
    static maybeXL(width: number, height: number): boolean;
    static maybeXXL(width: number, height: number): boolean;
    private _dp?;
    constructor(root: Root, isReal: boolean);
    /**
     * Currently added rules.
     */
    responsiveRules: IResponsiveRule[];
    /**
     * Instantiates the theme without adding default respomsive rules.
     */
    static newEmpty<T extends typeof ResponsiveTheme>(this: T, root: Root): InstanceType<T>;
    /**
     * Adds a responsive rule as well as retuns it.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/responsive/} for more info
     * @param   rule  Responsive rule
     * @return        Responsive rule
     */
    addRule(rule: IResponsiveRule): IResponsiveRule;
    /**
     * Removes the responsive rule.
     *
     * @param  rule  Responsive rule
     */
    removeRule(rule: IResponsiveRule): void;
    dispose(): void;
    protected _isUsed(): boolean;
    protected _maybeApplyRules(): void;
    protected _maybeApplyRule(rule: IResponsiveRule): void;
    protected _maybeUnapplyRule(rule: IResponsiveRule): void;
    /**
     * Adds default rules for various chart types and most standard scenarios.
     */
    protected setupDefaultRules(): void;
}
//# sourceMappingURL=ResponsiveTheme.d.ts.map
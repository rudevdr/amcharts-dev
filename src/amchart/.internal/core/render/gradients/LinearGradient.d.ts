import type { IGradient } from "../backend/Renderer";
import type { Sprite } from "../Sprite";
import { Gradient, IGradientSettings, IGradientPrivate } from "./Gradient";
export interface ILinearGradientSettings extends IGradientSettings {
    /**
     * Gradient rotation, in degrees.
     *
     * @default 90
     */
    rotation?: number;
}
export interface ILinearGradientPrivate extends IGradientPrivate {
}
/**
 * Linear gradient.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/gradients/} for more info
 */
export declare class LinearGradient extends Gradient {
    _settings: ILinearGradientSettings;
    _privateSettings: ILinearGradientPrivate;
    static className: string;
    static classNames: Array<string>;
    /**
     * @ignore
     */
    getFill(target: Sprite): IGradient;
}
//# sourceMappingURL=LinearGradient.d.ts.map
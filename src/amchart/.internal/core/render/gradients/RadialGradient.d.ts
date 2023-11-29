import type { IGradient } from "../backend/Renderer";
import type { Sprite } from "../Sprite";
import type { Percent } from "../../util/Percent";
import { Gradient, IGradientSettings, IGradientPrivate } from "./Gradient";
export interface IRadialGradientSettings extends IGradientSettings {
    /**
     * Gradient radius in pixels or percent (relative to the `target`).
     */
    radius?: number | Percent;
    /**
     * X position.
     */
    x?: number | Percent;
    /**
     * Y position.
     */
    y?: number | Percent;
}
export interface IRadialGradientPrivate extends IGradientPrivate {
}
/**
 * Radial gradient.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/gradients/} for more info
 */
export declare class RadialGradient extends Gradient {
    _settings: IRadialGradientSettings;
    _privateSettings: IRadialGradientPrivate;
    static className: string;
    static classNames: Array<string>;
    /**
     * @ignore
     */
    getFill(target: Sprite): IGradient;
}
//# sourceMappingURL=RadialGradient.d.ts.map
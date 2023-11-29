import type { IBounds } from "../../util/IBounds";
import type { IGradient, IGradientStop } from "../backend/Renderer";
import type { Sprite } from "../Sprite";
import { Entity, IEntitySettings, IEntityPrivate } from "../../util/Entity";
export interface IGradientSettings extends IEntitySettings {
    /**
     * A list of color steps for the gradient.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/gradients/} for more info
     */
    stops?: Array<IGradientStop>;
    /**
     * Gradient target.
     */
    target?: Sprite;
}
export interface IGradientPrivate extends IEntityPrivate {
}
/**
 * Base class for gradients.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/gradients/} for more info
 */
export declare abstract class Gradient extends Entity {
    _settings: IGradientSettings;
    _privateSettings: IGradientPrivate;
    static className: string;
    static classNames: Array<string>;
    protected _afterNew(): void;
    /**
     * @ignore
     */
    getFill(_target: Sprite): IGradient;
    _changed(): void;
    /**
     * @ignore
     */
    getBounds(target: Sprite): IBounds;
}
//# sourceMappingURL=Gradient.d.ts.map
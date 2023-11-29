import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "./Graphics";
import type { Percent } from "../../core/util/Percent";
export interface IStarSettings extends IGraphicsSettings {
    /**
     * Star's radius in pixels.
     */
    radius?: number;
    /**
     * Star's inner radius in pixels.
     */
    innerRadius?: number | Percent;
    /**
     * Number of spikes
     */
    spikes?: number;
}
export interface IStarPrivate extends IGraphicsPrivate {
}
/**
 * Draws a Star.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export declare class Star extends Graphics {
    _settings: IStarSettings;
    _privateSettings: IStarPrivate;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
    _changed(): void;
}
//# sourceMappingURL=Star.d.ts.map
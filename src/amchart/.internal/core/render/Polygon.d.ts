import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "./Graphics";
import type { IPoint } from "../util/IPoint";
import type { Time } from "../util/Animation";
import type { Animation } from "../util/Entity";
export interface IPolygonSettings extends IGraphicsSettings {
    /**
     * An array of polygon corner coordinates.
     */
    points?: Array<IPoint>;
    /**
     * Corodinates.
     */
    coordinates?: Array<Array<number>>;
    /**
     * Number of milliseconds to play morph animation.
     */
    animationDuration?: number;
    /**
     * Easing function to use for animations.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/#Easing_functions} for more info
     */
    animationEasing?: (t: Time) => Time;
}
export interface IPolygonPrivate extends IGraphicsPrivate {
    points?: Array<IPoint>;
    previousPoints?: Array<IPoint>;
    morphProgress?: number;
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
}
/**
 * Draws a polygon.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/polygon/} for more info
 * @important
 * @since 5.4.0
 */
export declare class Polygon extends Graphics {
    _settings: IPolygonSettings;
    _privateSettings: IPolygonPrivate;
    static className: string;
    static classNames: Array<string>;
    morphAnimation?: Animation<this["_privateSettings"]["morphProgress"]>;
    _beforeChanged(): void;
    _changed(): void;
    protected _draw(): void;
    _updateSize(): void;
}
//# sourceMappingURL=Polygon.d.ts.map
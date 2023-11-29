import type { Color } from "../util/Color";
import type { Pattern } from "../render/patterns/Pattern";
import type { Gradient } from "../render/gradients/Gradient";
import { ISpriteSettings, ISpritePrivate, ISpriteEvents, Sprite } from "./Sprite";
import { IGraphics, BlendMode } from "./backend/Renderer";
export declare const visualSettings: string[];
export interface IGraphicsSettings extends ISpriteSettings {
    /**
     * Fill color.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/} for more information
     */
    fill?: Color;
    /**
     * Stroke (border or line) color.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/} for more information
     */
    stroke?: Color;
    /**
     * Fill pattern.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/} for more information
     */
    fillPattern?: Pattern;
    /**
     * Stroke (border or line) pattern.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/} for more information
     */
    strokePattern?: Pattern;
    /**
     * Fill gradient.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/gradients/} for more information
     */
    fillGradient?: Gradient;
    /**
     * Stroke (border or line) gradient.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/gradients/} for more information
     */
    strokeGradient?: Gradient;
    /**
     * Stroke (border or line) dash settings.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/#Dashed_lines} for more information
     */
    strokeDasharray?: number[] | number;
    /**
     * Stroke (border or line) dash offset.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/#Dashed_lines} for more information
     */
    strokeDashoffset?: number;
    /**
     * Opacity of the fill. 0 - fully transparent; 1 - fully opaque.
     */
    fillOpacity?: number;
    /**
     * Opacity of the stroke (border or line). 0 - fully transparent; 1 - fully opaque.
     */
    strokeOpacity?: number;
    /**
     * Width of the stroke (border or line) in pixels.
     */
    strokeWidth?: number;
    /**
     * Indicates if stroke of a Graphics should stay the same when it's scale changes. Note, this doesn't take into account parent container scale changes.
     * @default false
     */
    nonScalingStroke?: boolean;
    /**
     * Drawing function.
     *
     * Must use renderer (`display` parameter) methods to draw.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/#Custom_draw_functions} for more info
     */
    draw?: (display: IGraphics, graphics: Graphics) => void;
    /**
     * Rendering mode.
     *
     * @default BlendMode.NORMAL ("source-over")
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation} for more information
     * @ignore
     */
    blendMode?: BlendMode;
    /**
     * Draw a shape using an SVG path.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths} for more information
     */
    svgPath?: string;
    /**
     * Color of the element's shadow.
     *
     * For this to work at least one of the following needs to be set as well:
     * `shadowBlur`, `shadowOffsetX`, `shadowOffsetY`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/shadows/} for more info
     */
    shadowColor?: Color | null;
    /**
     * Blurriness of the the shadow.
     *
     * The bigger the number, the more blurry shadow will be.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/shadows/} for more info
     */
    shadowBlur?: number;
    /**
     * Horizontal shadow offset in pixels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/shadows/} for more info
     */
    shadowOffsetX?: number;
    /**
     * Vertical shadow offset in pixels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/shadows/} for more info
     */
    shadowOffsetY?: number;
    /**
     * Opacity of the shadow (0-1).
     *
     * If not set, will use the same as `fillOpacity` of the element.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/shadows/} for more info
     */
    shadowOpacity?: number;
    /**
     * A method to be used on anchor points (joints) of the multi-point line.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin} for more info
     * @default "miter"
     * @since 5.2.10
     */
    lineJoin?: "miter" | "round" | "bevel";
}
export interface IGraphicsPrivate extends ISpritePrivate {
}
export interface IGraphicsEvents extends ISpriteEvents {
}
/**
 * Base class used for drawing shapes.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export declare class Graphics extends Sprite {
    _settings: IGraphicsSettings;
    _privateSettings: IGraphicsPrivate;
    _events: IGraphicsEvents;
    _display: IGraphics;
    protected _clear: boolean;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
    _changed(): void;
    _afterChanged(): void;
}
//# sourceMappingURL=Graphics.d.ts.map
import type { IPicture } from "./backend/Renderer";
import type { Color } from "../util/Color";
import { Sprite, ISpriteEvents, ISpriteSettings, ISpritePrivate } from "./Sprite";
export interface IPictureSettings extends ISpriteSettings {
    /**
     * A source URI of the image.
     *
     * Can be relative or absolute URL, or data-uri.
     */
    src?: string;
    /**
     * CORS settings for loading the image. Defaults to "anonymous".
     *
     * @since 5.3.6
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/crossOrigin} for more info
     */
    cors?: string | null;
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
}
export interface IPicturePrivate extends ISpritePrivate {
}
export interface IPictureEvents extends ISpriteEvents {
    /**
     * Invoked when picture is loaded.
     */
    loaded: {};
    /**
     * Invoked when picture load error happens.
     */
    loaderror: {};
}
/**
 * Displays an image.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/images/} for more info
 * @important
 */
export declare class Picture extends Sprite {
    _settings: IPictureSettings;
    _privateSettings: IPicturePrivate;
    _display: IPicture;
    static className: string;
    static classNames: Array<string>;
    _events: IPictureEvents;
    _changed(): void;
    protected _load(): void;
    _updateSize(): void;
}
//# sourceMappingURL=Picture.d.ts.map
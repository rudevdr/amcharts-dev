import { Pattern, IPatternSettings, IPatternPrivate, IPatternEvents } from "./Pattern";
export interface IPicturePatternSettings extends IPatternSettings {
    /**
     * A source URI of the image.
     *
     * Can be relative or absolute URL, or data-uri.
     */
    src?: string;
    /**
     * How pattern should be sized:
     *
     * * `"image"` (default) - pattern will be sized to actual image dimensions.
     * * `"pattern"` - image will sized to image dimensions.
     * * `"none"` - image will be placed in the pattern, regardless of either dimensions.
     *
     * @default "image"
     */
    fit?: "image" | "pattern" | "none";
    /**
     * Center images.
     *
     * @default true
     */
    centered?: boolean;
    canvas?: HTMLCanvasElement;
}
export interface IPicturePatternPrivate extends IPatternPrivate {
}
export interface IPicturePatternEvents extends IPatternEvents {
    /**
     * Invoked when related image is loaded.
     */
    loaded: {};
}
/**
 * Picture pattern.
 *
 * @since 5.2.15
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/} for more info
 */
export declare class PicturePattern extends Pattern {
    _settings: IPicturePatternSettings;
    _privateSettings: IPicturePatternPrivate;
    _events: IPicturePatternEvents;
    static className: string;
    static classNames: Array<string>;
    _image: HTMLImageElement | undefined;
    _beforeChanged(): void;
    protected _draw(): void;
    protected _load(): void;
}
//# sourceMappingURL=PicturePattern.d.ts.map
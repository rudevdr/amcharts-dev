import { Line, ILineSettings, ILinePrivate } from "./Line";
export interface ITickSettings extends ILineSettings {
    /**
     * Length in pixels.
     */
    length?: number;
    /**
     * Location within target space. 0 - beginning, 1 - end.
     */
    location?: number;
}
export interface ITickPrivate extends ILinePrivate {
}
/**
 * Draws a tick element (mostly used on axes).
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 */
export declare class Tick extends Line {
    _settings: ITickSettings;
    _privateSettings: ITickPrivate;
    static className: string;
    static classNames: Array<string>;
}
//# sourceMappingURL=Tick.d.ts.map
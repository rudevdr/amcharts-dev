import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "./Graphics";
import type { IPoint } from "../util/IPoint";
export interface ILineSettings extends IGraphicsSettings {
    /**
     * A list of [[IPoint]] (x/y coordinates) points for the line.
     */
    points?: Array<IPoint>;
    /**
     * A list of [[IPoint]] arrays for different segments of the line.
     *
     * @since 5.1.4
     */
    segments?: Array<Array<Array<IPoint>>>;
}
export interface ILinePrivate extends IGraphicsPrivate {
}
/**
 * Draws a line.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export declare class Line extends Graphics {
    _settings: ILineSettings;
    _privateSettings: ILinePrivate;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
    _changed(): void;
}
//# sourceMappingURL=Line.d.ts.map
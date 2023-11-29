import { Graphics, IGraphicsPrivate, IGraphicsSettings } from "../../../core/render/Graphics";
export interface IGridSettings extends IGraphicsSettings {
    /**
     * Relative location of the grid line within the cell.
     *
     * `0` - beginning, `0.5` - middle, `1` - end.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Location_of_axis_elements} for more info
     */
    location?: number;
}
export interface IGridPrivate extends IGraphicsPrivate {
}
/**
 * Creates an axis grid line.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Grid} for more info
 * @important
 */
export declare class Grid extends Graphics {
    _settings: IGridSettings;
    _privateSettings: IGridPrivate;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
}
//# sourceMappingURL=Grid.d.ts.map
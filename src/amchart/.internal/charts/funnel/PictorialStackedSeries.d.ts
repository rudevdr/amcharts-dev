import { PyramidSeries, IPyramidSeriesSettings, IPyramidSeriesDataItem, IPyramidSeriesPrivate } from "./PyramidSeries";
import { Graphics } from "../../core/render/Graphics";
export interface IPictorialStackedSeriesDataItem extends IPyramidSeriesDataItem {
}
export interface IPictorialStackedSeriesSettings extends IPyramidSeriesSettings {
    /**
     * An SVG path that will define the shape of the pictorial series.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/pictorial-stacked-series/#Shape_of_the_series} for more info
     */
    svgPath?: string;
}
export interface IPictorialStackedSeriesPrivate extends IPyramidSeriesPrivate {
}
/**
 * Creates a pictorial series for use in a [[SlicedChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/pictorial-stacked-series/} for more info
 * @important
 */
export declare class PictorialStackedSeries extends PyramidSeries {
    protected _tag: string;
    static className: string;
    static classNames: Array<string>;
    _settings: IPictorialStackedSeriesSettings;
    _privateSettings: IPictorialStackedSeriesPrivate;
    _dataItemSettings: IPictorialStackedSeriesDataItem;
    /**
     * A [[Graphics]] element to used as a mask (shape) for the series.
     *
     * This element is read-only. To modify the mask/shape, use the `svgPath` setting.
     */
    readonly seriesMask: Graphics;
    readonly seriesGraphics: Graphics;
    protected _afterNew(): void;
    protected _updateScale(): void;
    _prepareChildren(): void;
}
//# sourceMappingURL=PictorialStackedSeries.d.ts.map
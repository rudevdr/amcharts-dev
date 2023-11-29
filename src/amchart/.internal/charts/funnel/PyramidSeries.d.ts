import type { DataItem } from "../../core/render/Component";
import { FunnelSeries, IFunnelSeriesSettings, IFunnelSeriesDataItem, IFunnelSeriesPrivate } from "./FunnelSeries";
import { Percent } from "../../core/util/Percent";
export interface IPyramidSeriesDataItem extends IFunnelSeriesDataItem {
}
export interface IPyramidSeriesSettings extends IFunnelSeriesSettings {
    /**
     * The width of the tip of the pyramid.
     *
     * Can either be a fixed pixel value or percent relative to the space
     * available to the series.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/pyramid-series/#Tip_and_base} for more info
     * @default 0
     */
    topWidth?: number | Percent;
    /**
     * The width of the base of the pyramid.
     *
     * Can either be a fixed pixel value or percent relative to the space
     * available to the series.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/pyramid-series/#Tip_and_base} for more info
     * @default 0
     */
    bottomWidth?: number | Percent;
    /**
     * Determines calculation mechanism for the slice area based on value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/pyramid-series/#Slice_size} for more info
     * @default "area"
     */
    valueIs?: "area" | "height";
}
export interface IPyramidSeriesPrivate extends IFunnelSeriesPrivate {
}
/**
 * Creates a pyramid series for use in a [[SlicedChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/pyramid-series/} for more info
 * @important
 */
export declare class PyramidSeries extends FunnelSeries {
    protected _tag: string;
    static className: string;
    static classNames: Array<string>;
    _settings: IPyramidSeriesSettings;
    _privateSettings: IPyramidSeriesPrivate;
    _dataItemSettings: IPyramidSeriesDataItem;
    protected _nextSize: number | undefined;
    _prepareChildren(): void;
    protected decorateSlice(dataItem: DataItem<this["_dataItemSettings"]>): void;
}
//# sourceMappingURL=PyramidSeries.d.ts.map
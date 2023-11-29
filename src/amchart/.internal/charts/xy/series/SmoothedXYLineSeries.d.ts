import { LineSeries, ILineSeriesSettings, ILineSeriesPrivate, ILineSeriesDataItem } from "./LineSeries";
import { CurveCardinalFactory } from "d3-shape";
export interface SmoothedXYLineSeriesDataItem extends ILineSeriesDataItem {
}
export interface ISmoothedXYLineSeriesDataItem extends ILineSeriesDataItem {
}
export interface SmoothedXYLineSeriesProperties extends ILineSeriesSettings {
    /**
     * A tension force for the smoothing (0-1). The smaller the value the more
     * curvy the line will be.
     *
     * @default 0.5
     */
    tension?: number;
    /**
     * @ignore
    */
    curveFactory?: CurveCardinalFactory;
}
export interface SmoothedXYLineSeriesPrivate extends ILineSeriesPrivate {
}
/**
 * Smoothed line series suitable for XY (scatter) charts
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/smoothed-series/} for more info
 */
export declare class SmoothedXYLineSeries extends LineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: SmoothedXYLineSeriesProperties;
    _privateSettings: SmoothedXYLineSeriesPrivate;
    _dataItemSettings: SmoothedXYLineSeriesDataItem;
    protected _afterNew(): void;
    _updateChildren(): void;
}
//# sourceMappingURL=SmoothedXYLineSeries.d.ts.map
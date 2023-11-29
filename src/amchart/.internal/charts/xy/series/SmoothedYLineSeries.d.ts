import { LineSeries, ILineSeriesSettings, ILineSeriesPrivate, ILineSeriesDataItem } from "./LineSeries";
export interface ISmoothedYLineSeriesDataItem extends ILineSeriesDataItem {
}
export interface ISmoothedYLineSeriesSettings extends ILineSeriesSettings {
    /**
     * A tension force for the smoothing (0-1). The smaller the value the more
     * curvy the line will be.
     *
     * @default 0.5
     */
    tension?: number;
}
export interface ISmoothedYLineSeriesPrivate extends ILineSeriesPrivate {
}
/**
 * Smoothed line series suitable for vertical plots.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/smoothed-series/} for more info
 */
export declare class SmoothedYLineSeries extends LineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: ISmoothedYLineSeriesSettings;
    _privateSettings: ISmoothedYLineSeriesPrivate;
    _dataItemSettings: ISmoothedYLineSeriesDataItem;
    protected _afterNew(): void;
    _updateChildren(): void;
}
//# sourceMappingURL=SmoothedYLineSeries.d.ts.map
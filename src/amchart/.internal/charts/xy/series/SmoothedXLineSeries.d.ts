import { LineSeries, ILineSeriesSettings, ILineSeriesPrivate, ILineSeriesDataItem } from "./LineSeries";
export interface ISmoothedXLineSeriesDataItem extends ILineSeriesDataItem {
}
export interface ISmoothedXLineSeriesSettings extends ILineSeriesSettings {
    /**
     * A tension force for the smoothing (0-1). The smaller the value the more
     * curvy the line will be.
     *
     * @default 0.5
     */
    tension?: number;
}
export interface ISmoothedXLineSeriesPrivate extends ILineSeriesPrivate {
}
/**
 * Smoothed line series suitable for horizontal plots.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/smoothed-series/} for more info
 */
export declare class SmoothedXLineSeries extends LineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: ISmoothedXLineSeriesSettings;
    _privateSettings: ISmoothedXLineSeriesPrivate;
    _dataItemSettings: ISmoothedXLineSeriesDataItem;
    protected _afterNew(): void;
    _updateChildren(): void;
}
//# sourceMappingURL=SmoothedXLineSeries.d.ts.map
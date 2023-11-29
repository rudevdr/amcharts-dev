import { RadarLineSeries, IRadarLineSeriesSettings, IRadarLineSeriesPrivate, IRadarLineSeriesDataItem } from "./RadarLineSeries";
import { CurveCardinalFactory } from "d3-shape";
export interface ISmoothedRadarLineSeriesDataItem extends IRadarLineSeriesDataItem {
}
export interface ISmoothedRadarLineSeriesSettings extends IRadarLineSeriesSettings {
    /**
     * Tension of curve.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/smoothed-series/#Line_tension} for more info
     * @default 0.5
     */
    tension?: number;
    /**
     * @ignore
     */
    curveFactory?: CurveCardinalFactory;
}
export interface ISmoothedRadarLineSeriesPrivate extends IRadarLineSeriesPrivate {
}
/**
 * Draws a smoothed line series for use in a [[RadarChart]].
 *
 * @important
 */
export declare class SmoothedRadarLineSeries extends RadarLineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: ISmoothedRadarLineSeriesSettings;
    _privateSettings: ISmoothedRadarLineSeriesPrivate;
    _dataItemSettings: ISmoothedRadarLineSeriesDataItem;
    protected _afterNew(): void;
    _prepareChildren(): void;
    protected _endLine(_points: Array<Array<number>>, _firstPoint: Array<number>): void;
}
//# sourceMappingURL=SmoothedRadarLineSeries.d.ts.map
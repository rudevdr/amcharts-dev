import { LineSeries, ILineSeriesPrivate, ILineSeriesSettings, ILineSeriesDataItem, ILineSeriesAxisRange } from "../xy/series/LineSeries";
import type { IPoint } from "../../core/util/IPoint";
import type { Bullet } from "../../core/render/Bullet";
import type { RadarChart } from "./RadarChart";
export interface IRadarLineSeriesDataItem extends ILineSeriesDataItem {
}
export interface IRadarLineSeriesSettings extends ILineSeriesSettings {
    /**
     * If set to `true` (default), series will connect its last data point to the
     * first one with a line, thus completing full circle.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/radar-series/#Connecting_ends} for more info
     * @default @true
     */
    connectEnds?: boolean;
}
export interface IRadarLineSeriesPrivate extends ILineSeriesPrivate {
}
export interface IRadarLineSeriesAxisRange extends ILineSeriesAxisRange {
}
/**
 * Draws a line series for use in a [[RadarChart]].
 *
 * @important
 */
export declare class RadarLineSeries extends LineSeries {
    _settings: IRadarLineSeriesSettings;
    _privateSettings: IRadarLineSeriesPrivate;
    _dataItemSettings: IRadarLineSeriesDataItem;
    _axisRangeType: IRadarLineSeriesAxisRange;
    /**
     * A chart series belongs to.
     */
    chart: RadarChart | undefined;
    static className: string;
    static classNames: Array<string>;
    protected _afterNew(): void;
    protected _handleMaskBullets(): void;
    getPoint(positionX: number, positionY: number): IPoint;
    protected _endLine(points: Array<Array<number>>, firstPoint: Array<number>): void;
    protected _shouldInclude(position: number): boolean;
    protected _shouldShowBullet(positionX: number, _positionY: number): boolean;
    _positionBullet(bullet: Bullet): void;
}
//# sourceMappingURL=RadarLineSeries.d.ts.map
import type { DataItem } from "../../core/render/Component";
import type { IPoint } from "../../core/util/IPoint";
import type { Bullet } from "../../core/render/Bullet";
import type { RadarChart } from "./RadarChart";
import { BaseColumnSeries, IBaseColumnSeriesPrivate, IBaseColumnSeriesSettings, IBaseColumnSeriesDataItem, IBaseColumnSeriesAxisRange } from "../xy/series/BaseColumnSeries";
import { Slice } from "../../core/render/Slice";
import { Graphics } from "../../core/render/Graphics";
import { ListTemplate } from "../../core/util/List";
export interface IRadarColumnSeriesDataItem extends IBaseColumnSeriesDataItem {
    /**
     * Actual radius of the column in pixels.
     */
    radius?: number;
    /**
     * Actual inner radius of the column in pixels.
     */
    innerRadius?: number;
    /**
     * Actual start angle of the column in degrees.
     */
    startAngle?: number;
    /**
     * Actual end angle of the column in degrees.
     */
    endAngle?: number;
}
export interface IRadarColumnSeriesSettings extends IBaseColumnSeriesSettings {
}
export interface IRadarColumnSeriesPrivate extends IBaseColumnSeriesPrivate {
}
export interface IRadarColumnSeriesAxisRange extends IBaseColumnSeriesAxisRange {
    /**
     * List of columns in a range.
     */
    columns: ListTemplate<Slice>;
}
/**
 * A column series for use in a [[RadarChart]].
 *
 * @important
 */
export declare class RadarColumnSeries extends BaseColumnSeries {
    _settings: IRadarColumnSeriesSettings;
    _privateSettings: IRadarColumnSeriesPrivate;
    _dataItemSettings: IRadarColumnSeriesDataItem;
    _axisRangeType: IRadarColumnSeriesAxisRange;
    /**
     * @ignore
     */
    makeColumn(dataItem: DataItem<this["_dataItemSettings"]>, listTemplate: ListTemplate<Slice>): Slice;
    /**
     * A [[TemplateList]] of all columns in series.
     *
     * `columns.template` can be used to set default settings for all columns,
     * or to change on existing ones.
     *
     * @default new ListTemplate<Slice>
     */
    readonly columns: ListTemplate<Slice>;
    static className: string;
    static classNames: Array<string>;
    /**
     * A chart series belongs to.
     */
    chart: RadarChart | undefined;
    protected _afterNew(): void;
    /**
     * @ignore
     */
    getPoint(positionX: number, positionY: number): IPoint;
    protected _updateSeriesGraphics(dataItem: DataItem<this["_dataItemSettings"]>, graphics: Graphics, l: number, r: number, t: number, b: number): void;
    protected _shouldInclude(position: number): boolean;
    protected _shouldShowBullet(positionX: number, _positionY: number): boolean;
    _positionBullet(bullet: Bullet): void;
    protected _handleMaskBullets(): void;
    protected _processAxisRange(axisRange: this["_axisRangeType"]): void;
}
//# sourceMappingURL=RadarColumnSeries.d.ts.map
import type { DataItem } from "../../../core/render/Component";
import { BaseColumnSeries, IBaseColumnSeriesPrivate, IBaseColumnSeriesSettings, IBaseColumnSeriesDataItem, IBaseColumnSeriesAxisRange } from "./BaseColumnSeries";
import { ListTemplate } from "../../../core/util/List";
import { RoundedRectangle } from "../../../core/render/RoundedRectangle";
export interface IColumnSeriesDataItem extends IBaseColumnSeriesDataItem {
}
export interface IColumnSeriesSettings extends IBaseColumnSeriesSettings {
}
export interface IColumnSeriesPrivate extends IBaseColumnSeriesPrivate {
}
export interface IColumnSeriesAxisRange extends IBaseColumnSeriesAxisRange {
    /**
     * A list of actual columns in a range.
     */
    columns: ListTemplate<RoundedRectangle>;
}
export declare class ColumnSeries extends BaseColumnSeries {
    _settings: IColumnSeriesSettings;
    _privateSettings: IColumnSeriesPrivate;
    _dataItemSettings: IColumnSeriesDataItem;
    _axisRangeType: IColumnSeriesAxisRange;
    /**
     * @ignore
     */
    makeColumn(dataItem: DataItem<this["_dataItemSettings"]>, listTemplate: ListTemplate<RoundedRectangle>): RoundedRectangle;
    /**
     * A [[TemplateList]] of all columns in series.
     *
     * `columns.template` can be used to set default settings for all columns,
     * or to change on existing ones.
     */
    readonly columns: ListTemplate<RoundedRectangle>;
    static className: string;
    static classNames: Array<string>;
    protected _processAxisRange(axisRange: this["_axisRangeType"]): void;
}
//# sourceMappingURL=ColumnSeries.d.ts.map
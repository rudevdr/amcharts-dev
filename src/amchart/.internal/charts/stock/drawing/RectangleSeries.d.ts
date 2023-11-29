import type { DataItem } from "../../../core/render/Component";
import type { Graphics } from "../../../core/render/Graphics";
import type { IPoint } from "../../../core/util/IPoint";
import { SimpleLineSeries, ISimpleLineSeriesSettings, ISimpleLineSeriesPrivate, ISimpleLineSeriesDataItem } from "./SimpleLineSeries";
export interface IRectangleSeriesDataItem extends ISimpleLineSeriesDataItem {
}
export interface IRectangleSeriesSettings extends ISimpleLineSeriesSettings {
}
export interface IRectangleSeriesPrivate extends ISimpleLineSeriesPrivate {
}
export declare class RectangleSeries extends SimpleLineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IRectangleSeriesSettings;
    _privateSettings: IRectangleSeriesPrivate;
    _dataItemSettings: IRectangleSeriesDataItem;
    protected _index: number;
    protected _di: Array<{
        [index: string]: DataItem<IRectangleSeriesDataItem>;
    }>;
    protected _tag: string;
    protected _updateSegment(index: number): void;
    protected _setXLocation(dataItem: DataItem<this["_dataItemSettings"]>, value: number): void;
    _updateChildren(): void;
    protected _updateOthers(_index: number, _fillGraphics: Graphics, _p1: IPoint, _p2: IPoint): void;
    protected _drawFill(): void;
    protected _updateLine(): void;
}
//# sourceMappingURL=RectangleSeries.d.ts.map
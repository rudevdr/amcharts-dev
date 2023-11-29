import type { DataItem } from "../../../core/render/Component";
import type { Graphics } from "../../../core/render/Graphics";
import type { IPoint } from "../../../core/util/IPoint";
import { SimpleLineSeries, ISimpleLineSeriesSettings, ISimpleLineSeriesPrivate, ISimpleLineSeriesDataItem } from "./SimpleLineSeries";
import type { ISpritePointerEvent } from "../../../core/render/Sprite";
export interface IParallelChannelSeriesDataItem extends ISimpleLineSeriesDataItem {
}
export interface IParallelChannelSeriesSettings extends ISimpleLineSeriesSettings {
}
export interface IParallelChannelSeriesPrivate extends ISimpleLineSeriesPrivate {
}
export declare class ParallelChannelSeries extends SimpleLineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IParallelChannelSeriesSettings;
    _privateSettings: IParallelChannelSeriesPrivate;
    _dataItemSettings: IParallelChannelSeriesDataItem;
    protected _index: number;
    protected _di: Array<{
        [index: string]: DataItem<IParallelChannelSeriesDataItem>;
    }>;
    protected _tag: string;
    protected _firstClick: boolean;
    protected _addPointsReal(valueX: number, valueY: number, index: number): void;
    protected _handlePointerClickReal(event: ISpritePointerEvent): void;
    protected _handlePointerMoveReal(_event: ISpritePointerEvent): void;
    _updateChildren(): void;
    protected _handleBulletDraggedReal(dataItem: DataItem<this["_dataItemSettings"]>, point: IPoint): void;
    protected _updateOthers(_index: number, _fillGraphics: Graphics, _p1: IPoint, _p2: IPoint): void;
    protected _drawFill(): void;
    protected _updateLine(): void;
}
//# sourceMappingURL=ParallelChannelSeries.d.ts.map
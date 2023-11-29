import type { ISpritePointerEvent } from "../../../core/render/Sprite";
import type { IPoint } from "../../../core/util/IPoint";
import type { Line } from "../../../core/render/Line";
import type { Template } from "../../../core/util/Template";
import { SimpleLineSeries, ISimpleLineSeriesSettings, ISimpleLineSeriesPrivate, ISimpleLineSeriesDataItem } from "./SimpleLineSeries";
export interface IHorizontalRaySeriesDataItem extends ISimpleLineSeriesDataItem {
}
export interface IHorizontalRaySeriesSettings extends ISimpleLineSeriesSettings {
}
export interface IHorizontalRaySeriesPrivate extends ISimpleLineSeriesPrivate {
}
export declare class HorizontalRaySeries extends SimpleLineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IHorizontalRaySeriesSettings;
    _privateSettings: IHorizontalRaySeriesPrivate;
    _dataItemSettings: IHorizontalRaySeriesDataItem;
    protected _tag: string;
    protected _updateSegment(index: number): void;
    protected _updateLine(index: number, p11: IPoint, _p22: IPoint, p1: IPoint, _p2: IPoint): void;
    protected _handlePointerMoveReal(): void;
    protected _handlePointerClickReal(event: ISpritePointerEvent): void;
    protected _updateExtensionLine(line: Line, template: Template<any>): void;
}
//# sourceMappingURL=HorizontalRaySeries.d.ts.map
import type { ISpritePointerEvent } from "../../../core/render/Sprite";
import { DrawingSeries, IDrawingSeriesSettings, IDrawingSeriesPrivate, IDrawingSeriesDataItem } from "./DrawingSeries";
export interface IDoodleSeriesDataItem extends IDrawingSeriesDataItem {
}
export interface IDoodleSeriesSettings extends IDrawingSeriesSettings {
}
export interface IDoodleSeriesPrivate extends IDrawingSeriesPrivate {
}
export declare class DoodleSeries extends DrawingSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IDoodleSeriesSettings;
    _privateSettings: IDoodleSeriesPrivate;
    _dataItemSettings: IDoodleSeriesDataItem;
    protected _panX?: boolean;
    protected _panY?: boolean;
    protected _pIndex: number;
    protected _tag: string;
    protected _afterNew(): void;
    protected _handlePointerMove(event: ISpritePointerEvent): void;
    protected _handleBulletPosition(event: ISpritePointerEvent): void;
    protected _handleFillDragStart(e: ISpritePointerEvent, index: number): void;
    protected _handlePointerDown(event: ISpritePointerEvent): void;
    protected _handlePointerUp(event: ISpritePointerEvent): void;
}
//# sourceMappingURL=DoodleSeries.d.ts.map
import type { ISpritePointerEvent } from "../../../core/render/Sprite";
import type { DataItem } from "../../../core/render/Component";
import type { IPoint } from "../../../core/util/IPoint";
import { DrawingSeries, IDrawingSeriesSettings, IDrawingSeriesPrivate, IDrawingSeriesDataItem } from "./DrawingSeries";
import { Line } from "../../../core/render/Line";
import { ListTemplate } from "../../../core/util/List";
import { Template } from "../../../core/util/Template";
export interface ISimpleLineSeriesDataItem extends IDrawingSeriesDataItem {
}
export interface ISimpleLineSeriesSettings extends IDrawingSeriesSettings {
    /**
     * Show a dotted line extending from both ends of the drawn line.
     *
     * @default true
     */
    showExtension?: boolean;
}
export interface ISimpleLineSeriesPrivate extends IDrawingSeriesPrivate {
}
export declare class SimpleLineSeries extends DrawingSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: ISimpleLineSeriesSettings;
    _privateSettings: ISimpleLineSeriesPrivate;
    _dataItemSettings: ISimpleLineSeriesDataItem;
    protected _tag: string;
    protected _updateExtension: boolean;
    /**
     * @ignore
     */
    makeLine(): Line;
    readonly lines: ListTemplate<Line>;
    /**
     * @ignore
     */
    makeHitLine(): Line;
    readonly hitLines: ListTemplate<Line>;
    protected _di: Array<{
        [index: string]: DataItem<ISimpleLineSeriesDataItem>;
    }>;
    protected _lines: Array<Line>;
    protected _hitLines: Array<Line>;
    protected _afterNew(): void;
    protected _updateElements(): void;
    protected _updateLine(index: number, p11: IPoint, p22: IPoint, p1: IPoint, p2: IPoint): void;
    protected _handlePointerClickReal(event: ISpritePointerEvent): void;
    protected _handlePointerClick(event: ISpritePointerEvent): void;
    protected _handlePointerMove(event: ISpritePointerEvent): void;
    protected _handlePointerMoveReal(_event: ISpritePointerEvent): void;
    protected _createElements(index: number): void;
    protected _updateExtensionLine(_line: Line, _template: Template<any>): void;
    protected _addTemplates(index: number): void;
    protected _addPoints(event: ISpritePointerEvent, index: number): void;
    protected _addPointsReal(valueX: number, valueY: number, index: number): void;
    protected _addPoint(valueX: number, valueY: number, corner: string, index: number): void;
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    setInteractive(value: boolean): void;
}
//# sourceMappingURL=SimpleLineSeries.d.ts.map
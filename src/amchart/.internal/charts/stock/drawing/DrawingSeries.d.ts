import type { IDisposer } from "../../../core/util/Disposer";
import type { IPoint } from "../../../core/util/IPoint";
import type { Color } from "../../../core/util/Color";
import type { ISpritePointerEvent } from "../../../core/render/Sprite";
import type { ValueAxis } from "../../xy/axes/ValueAxis";
import type { DateAxis } from "../../xy/axes/DateAxis";
import type { AxisRenderer } from "../../xy/axes/AxisRenderer";
import type { Sprite } from "../../../core/render/Sprite";
import type { DataItem } from "../../../core/render/Component";
import type { XYSeries } from "../../xy/series/XYSeries";
import { LineSeries, ILineSeriesSettings, ILineSeriesPrivate, ILineSeriesDataItem } from "../../xy/series/LineSeries";
import { Circle } from "../../../core/render/Circle";
import { Container } from "../../../core/render/Container";
import { Template } from "../../../core/util/Template";
import { ListTemplate } from "../../../core/util/List";
export interface IDrawingSeriesDataItem extends ILineSeriesDataItem {
}
export interface IDrawingSeriesSettings extends ILineSeriesSettings {
    /**
     * X-Axis.
     */
    xAxis: DateAxis<AxisRenderer>;
    /**
     * Y-axis.
     */
    yAxis: ValueAxis<AxisRenderer>;
    /**
     * Color of the lines/borders.
     */
    strokeColor?: Color;
    /**
     * Color of the fills.
     */
    fillColor?: Color;
    /**
     * Opacity of the lines/borders (0-1).
     */
    strokeOpacity?: number;
    /**
     * Opacity of the fills (0-1).
     */
    fillOpacity?: number;
    /**
     * Width of the lines/borders in pixels.
     */
    strokeWidth?: number;
    /**
     * Dash information for lines/borders.
     */
    strokeDasharray?: Array<number>;
    /**
     * [[XYSeries]] used for drawing.
     */
    series?: XYSeries;
    /**
     * Indicates if drawings should snap to x and y values.
     * @ignore
     */
    snapToData?: boolean;
    /**
     * Value field to use when snapping data or calculating averages/regresions/etc.
     *
     * @default "value"
     */
    field?: "open" | "value" | "low" | "high";
}
export interface IDrawingSeriesPrivate extends ILineSeriesPrivate {
    allowChangeSnap?: boolean;
}
export declare class DrawingSeries extends LineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IDrawingSeriesSettings;
    _privateSettings: IDrawingSeriesPrivate;
    _dataItemSettings: IDrawingSeriesDataItem;
    protected _clickDp?: IDisposer;
    protected _moveDp?: IDisposer;
    protected _downDp?: IDisposer;
    protected _upDp?: IDisposer;
    protected _drawingEnabled: boolean;
    protected _isDragging: boolean;
    protected _clickPointerPoint?: IPoint;
    protected _movePointerPoint?: IPoint;
    protected _isDrawing: boolean;
    protected _isPointerDown: boolean;
    protected _index: number;
    protected _di: Array<{
        [index: string]: DataItem<IDrawingSeriesDataItem>;
    }>;
    protected _dragStartPX: number;
    protected _dragStartY: number;
    protected _dvpX: {
        [index: string]: number | undefined;
    };
    protected _dvY: {
        [index: string]: number | undefined;
    };
    protected _isHover: boolean;
    protected _erasingEnabled: boolean;
    protected _tag?: string;
    protected _movePoint: IPoint;
    readonly grips: ListTemplate<Container>;
    readonly circles: ListTemplate<Circle>;
    readonly outerCircles: ListTemplate<Circle>;
    protected _afterNew(): void;
    protected _disposeIndex(index: number): void;
    protected _afterDataChange(): void;
    protected _createElements(_index: number, _dataItem?: DataItem<IDrawingSeriesDataItem>): void;
    clearDrawings(): void;
    protected _getIndex(sprite: Sprite): number;
    protected _getStrokeIndex(index: number): number;
    setInteractive(value: boolean): void;
    protected _showSegmentBullets(index: number): void;
    protected _hideAllBullets(): void;
    protected showAllBullets(): void;
    protected _handleFillDragStart(event: ISpritePointerEvent, index: number): void;
    protected _handleFillDragStop(event: ISpritePointerEvent, index: number): void;
    protected _updateSegment(_index: number): void;
    _updateChildren(): void;
    protected _updateElements(): void;
    markDirtyDrawings(): void;
    protected _getFillTemplate(): Template<any>;
    protected _getStrokeTemplate(): Template<any>;
    protected _tweakBullet(_container: Container, _dataItem: DataItem<IDrawingSeriesDataItem>): void;
    protected _addBulletInteraction(sprite: Sprite): void;
    protected _handlePointerClick(event: ISpritePointerEvent): void;
    _placeBulletsContainer(): void;
    protected _handleBulletDragged(event: ISpritePointerEvent): void;
    protected _handleBulletDraggedReal(dataItem: DataItem<this["_dataItemSettings"]>, point: IPoint): void;
    protected _handleBulletDragStart(_event: ISpritePointerEvent): void;
    protected _handleBulletDragStop(_event: ISpritePointerEvent): void;
    protected _handlePointerOver(): void;
    protected _handlePointerOut(): void;
    enableDrawing(): void;
    enableErasing(): void;
    disableErasing(): void;
    disableDrawing(): void;
    protected _handlePointerMove(event: ISpritePointerEvent): void;
    protected _handlePointerDown(_event: ISpritePointerEvent): void;
    protected _handlePointerUp(_event: ISpritePointerEvent): void;
    startIndex(): number;
    endIndex(): number;
    protected _setXLocation(dataItem: DataItem<this["_dataItemSettings"]>, value: number): void;
    protected _setXLocationReal(dataItem: DataItem<this["_dataItemSettings"]>, value: number): void;
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _getYValue(value: number, valueX: number): number;
    protected _getXValue(value: number): number;
    _setContext(dataItem: DataItem<IDrawingSeriesDataItem>, key: any, value: any, working?: boolean): void;
    protected _snap(value: number, realValue: number, key: string, series: XYSeries): number;
}
//# sourceMappingURL=DrawingSeries.d.ts.map
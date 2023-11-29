import type { IPoint } from "../../core/util/IPoint";
import type { RadarChart } from "./RadarChart";
import type { Percent } from "../../core/util/Percent";
import type { Tooltip } from "../../core/render/Tooltip";
import { XYCursor, IXYCursorSettings, IXYCursorPrivate, IXYCursorEvents } from "../xy/XYCursor";
export interface IRadarCursorSettings extends IXYCursorSettings {
    /**
     * Cursor's inner radius.
     */
    innerRadius?: number | Percent;
    /**
     * Cursor's inner radius.
     */
    radius?: number | Percent;
    /**
     * Cursor's position angle in degrees.
     */
    startAngle?: number;
    /**
     * Cursor's selection end angle in degrees.
     */
    endAngle?: number;
}
export interface IRadarCursorPrivate extends IXYCursorPrivate {
    /**
     * Actual radius of the cursor in pixels.
     */
    radius: number;
    /**
     * Actual inner radius of the cursor in pixels.
     */
    innerRadius: number;
    /**
     * Actual start angle of the cursor in degrees.
     */
    startAngle: number;
    /**
     * Actual end angle of the cursor in degrees.
     */
    endAngle: number;
}
export interface IRadarCursorEvents extends IXYCursorEvents {
}
/**
 * Creates a cursor for a [[RadarChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor} for more info
 */
export declare class RadarCursor extends XYCursor {
    static className: string;
    static classNames: Array<string>;
    _settings: IRadarCursorSettings;
    _privateSettings: IRadarCursorPrivate;
    _events: IRadarCursorEvents;
    /**
     * A chart cursor is attached to.
     */
    chart: RadarChart | undefined;
    protected _fillGenerator: import("d3-shape").Arc<any, import("d3-shape").DefaultArcObject>;
    protected _afterNew(): void;
    protected _handleXLine(): void;
    protected _handleYLine(): void;
    protected _getPosition(point: IPoint): IPoint;
    protected _getPoint(positionX: number, positionY: number): IPoint;
    /**
     * @ignore
     */
    updateLayout(): void;
    protected _updateLines(x: number, y: number): void;
    protected _drawXLine(x: number, y: number): void;
    protected _drawYLine(x: number, y: number): void;
    protected _updateXLine(tooltip: Tooltip): void;
    protected _updateYLine(tooltip: Tooltip): void;
    protected _inPlot(point: IPoint): boolean;
    protected _updateSelection(point: IPoint): void;
}
//# sourceMappingURL=RadarCursor.d.ts.map
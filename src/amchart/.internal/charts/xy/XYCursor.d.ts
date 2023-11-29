import type { IPoint } from "../../core/util/IPoint";
import type { XYChart } from "./XYChart";
import type { XYSeries } from "./series/XYSeries";
import type { ISpritePointerEvent } from "../../core/render/Sprite";
import type { Axis } from "./axes/Axis";
import type { AxisRenderer } from "./axes/AxisRenderer";
import type { Tooltip } from "../../core/render/Tooltip";
import { Container, IContainerSettings, IContainerPrivate, IContainerEvents } from "../../core/render/Container";
import { Graphics } from "../../core/render/Graphics";
import { Grid } from "./axes/Grid";
import type { IPointerEvent } from "../../core/render/backend/Renderer";
export interface IXYCursorSettings extends IContainerSettings {
    /**
     * Cursor's X axis.
     *
     * If set, cursor will snap to that axis' cells.
     */
    xAxis?: Axis<AxisRenderer>;
    /**
     * Cursor's Y axis.
     *
     * If set, cursor will snap to that axis' cells.
     */
    yAxis?: Axis<AxisRenderer>;
    /**
     * What should cursor do when dragged across plot area.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/#Behavior} for more info
     * @default "none"
     */
    behavior?: "zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "none";
    /**
     * Cursor's horizontal position relative to plot area.
     *
     * If this setting is set, cursor will not react to mouse/touch and will just
     * sit at specified position until `positionX` is reset to `undefined`.
     *
     * `0` - left, `1` - right.
     */
    positionX?: number;
    /**
     * Cursor's vertical position relative to plot area.
     *
     * If this setting is set, cursor will not react to mouse/touch and will just
     * sit at specified position until `positionY` is reset to `undefined`.
     *
     * `0` - left, `1` - right.
     */
    positionY?: number;
    /**
     * If set to `true`, cursor will not be hidden when mouse cursor moves out
     * of the plot area.
     *
     * @default false
     */
    alwaysShow?: boolean;
    /**
     * A list of series to snap cursor to.
     *
     * If set, the cursor will always snap to the closest data item of listed
     * series.
     */
    snapToSeries?: Array<XYSeries>;
    /**
     * Defines in which direction to look when searching for the nearest data
     * item to snap to.
     *
     * Possible values: `"xy"` (default), `"x"`, and `"y"`.
     *
     * @since 5.0.6
     * @default "xy"
     */
    snapToSeriesBy?: "xy" | "x" | "y" | "x!" | "y!";
    /**
     * An array of other [[XYCursor]] objects to sync this cursor with.
     *
     * If set will automatically move synced cursors to the same position within
     * their respective axes as the this cursor assumin same XY coordinates of
     * the pointer.
     *
     * NOTE: Syncing is performed using actual X/Y coordinates of the point of
     * mouse cursor's position or touch. It means that they will not sync by axis
     * positions, but rather by screen coordinates. For example vertical lines
     * will not sync across horizontally laid out charts, and vice versa.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/#syncing-cursors} for more info
     * @since 5.1.4
     */
    syncWith?: Array<XYCursor>;
    /**
     * Minimum distance in pixels between down and up points.
     *
     * If a distance is less than the value of `moveThreshold`, the zoom or
     * selection won't happen.
     *
     * @since 5.2.20
     * @default 1
     */
    moveThreshold?: number;
}
export interface IXYCursorPrivate extends IContainerPrivate {
    /**
     * Current X/Y coordinates of the cursor.
     */
    point?: IPoint;
    /**
     * Current horizontal position relative to the plot area (0-1).
     */
    positionX?: number;
    /**
     * Current vertical position relative to the plot area (0-1).
     */
    positionY?: number;
    /**
     * Horizontal cursor position on the moment when selection started.
     */
    downPositionX?: number;
    /**
     * Vertical cursor position on the moment when selection started.
     */
    downPositionY?: number;
    /**
     * Last global point to which cursor moved
     */
    lastPoint?: IPoint;
}
export interface IXYCursorEvents extends IContainerEvents {
    /**
     * Kicks in when cursor selection ends.
     *
     * Only when `behavior` is set.
     */
    selectended: {
        originalEvent: IPointerEvent;
        target: XYCursor;
    };
    /**
     * Kicks in when cursor selection starts.
     *
     * Only when `behavior` is set.
     */
    selectstarted: {
        originalEvent: IPointerEvent;
        target: XYCursor;
    };
    /**
     * Kicks in when cursor's position over plot area changes.
     */
    cursormoved: {
        point: IPoint;
        target: XYCursor;
        originalEvent?: IPointerEvent;
    };
    /**
     * Kicks in when cursor's is hidden when user rolls-out of the plot area
     */
    cursorhidden: {
        target: XYCursor;
    };
    /**
     * Invoked if pointer is pressed down on a plot area and released without
     * moving (only when behavior is `"selectX"`).
     *
     * @since 5.4.7
     */
    selectcancelled: {
        originalEvent: IPointerEvent;
        target: XYCursor;
    };
}
/**
 * Creates a chart cursor for an [[XYChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/} for more info
 * @important
 */
export declare class XYCursor extends Container {
    static className: string;
    static classNames: Array<string>;
    _settings: IXYCursorSettings;
    _privateSettings: IXYCursorPrivate;
    _events: IXYCursorEvents;
    /**
     * A [[Grid]] elment that used for horizontal line of the cursor crosshair.
     *
     * @default Grid.new()
     */
    readonly lineX: Grid;
    /**
     * A [[Grid]] elment that used for horizontal line of the cursor crosshair.
     *
     * @default Grid.new()
     */
    readonly lineY: Grid;
    /**
     * An element that represents current selection.
     *
     * @default Graphics.new()
     */
    readonly selection: Graphics;
    protected _movePoint: IPoint | undefined;
    protected _lastPoint: IPoint;
    protected _tooltipX: boolean;
    protected _tooltipY: boolean;
    /**
     * A chart cursor is attached to.
     */
    chart: XYChart | undefined;
    protected _toX?: number;
    protected _toY?: number;
    protected _afterNew(): void;
    protected _setUpTouch(): void;
    protected _handleXLine(): void;
    protected _handleYLine(): void;
    protected _handleLineMove(keyCode: number): void;
    protected _handleLineFocus(_line: Grid): void;
    protected _handleLineBlur(_line: Grid): void;
    _prepareChildren(): void;
    protected _handleSyncWith(): void;
    _updateChildren(): void;
    protected _updateXLine(tooltip: Tooltip): void;
    protected _updateYLine(tooltip: Tooltip): void;
    protected _drawLines(): void;
    updateCursor(): void;
    _setChart(chart: XYChart): void;
    protected _inPlot(point: IPoint): boolean;
    protected _handleCursorDown(event: ISpritePointerEvent): void;
    protected _handleCursorUp(event: ISpritePointerEvent): void;
    protected _handleMove(event: ISpritePointerEvent): void;
    protected _getPosition(point: IPoint): IPoint;
    /**
     * Moves the cursor to X/Y coordinates within chart container (`point`).
     *
     * If `skipEvent` parameter is set to `true`, the move will not invoke
     * the `"cursormoved"` event.
     *
     * @param  point      X/Y to move cursor to
     * @param  skipEvent  Do not fire "cursormoved" event
     */
    handleMove(point?: IPoint, skipEvent?: boolean, originalEvent?: IPointerEvent): void;
    protected _getPoint(positionX: number, positionY: number): IPoint;
    protected _updateLines(x: number, y: number): void;
    protected _updateSelection(point: IPoint): void;
    protected _onHide(): void;
    protected _onShow(): void;
    protected _dispose(): void;
}
//# sourceMappingURL=XYCursor.d.ts.map
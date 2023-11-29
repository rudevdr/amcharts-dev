import type { Sprite, ISpritePointerEvent } from "../../../core/render/Sprite";
import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "../../../core/render/Graphics";
import type { Axis, IAxisDataItem } from "./Axis";
import { ListTemplate } from "../../../core/util/List";
import { AxisTick } from "./AxisTick";
import { Grid } from "./Grid";
import { AxisLabel } from "./AxisLabel";
import type { IPoint } from "../../../core/util/IPoint";
import type { Tooltip } from "../../../core/render/Tooltip";
import type { AxisBullet } from "./AxisBullet";
import type { XYChart } from "../XYChart";
import type { DataItem } from "../../../core/render/Component";
export interface IAxisRendererSettings extends IGraphicsSettings {
    /**
     * The minimum distance between grid lines in pixels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Grid_density} for more info
     */
    minGridDistance?: number;
    /**
     * Re-enable display of skipped grid lines due to lack of space and as per
     * the `minGridDistance` setting. Not recommended for CategoryAxis with a lot of data items.
     *
     * @default false
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Minor_grid} for more info
     * @since 5.6.0
     */
    minorGridEnabled?: boolean;
    /**
     * Enable labels on minor grid. If you enable labels, grid will be enabled automatically.
     *
     * @default false
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Enabling_minor_grid_labels} for more info
     * @since 5.6.0
     */
    minorLabelsEnabled?: boolean;
    /**
     * Set to `true` to invert direction of the axis.
     *
     * @default false
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Inversed_axes} for more info
     */
    inversed?: boolean;
    /**
     * Indicates relative position where "usable" space of the cell starts.
     *
     * `0` - beginning, `1` - end, or anything in-between.
     *
     * @default 0
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Cell_start_end_locations} for more info
     */
    cellStartLocation?: number;
    /**
     * Indicates relative position where "usable" space of the cell ends.
     *
     * `0` - beginning, `1` - end, or anything in-between.
     *
     * @default 1
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Cell_start_end_locations} for more info
     */
    cellEndLocation?: number;
    /**
     * If set to `"zoom"` will enable axis zoom by panning it in the axis label
     * area.
     *
     * Works on [[AxisRendererX]] and [[AxisRendererY]] only.
     *
     * For a better result, set `maxDeviation` to `1` or so on the Axis.
     *
     * Will not work if `inside` is set to `true`.
     *
     * @since 5.0.7
     * @default "none"
     */
    pan?: "none" | "zoom";
}
export interface IAxisRendererPrivate extends IGraphicsPrivate {
    /**
     * @ignore
     */
    letter?: "X" | "Y";
}
/**
 * Base class for an axis renderer.
 *
 * Should not be used on its own.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/#Axis_renderer} for more info
 */
export declare abstract class AxisRenderer extends Graphics {
    static className: string;
    static classNames: Array<string>;
    _axisLength: number;
    _start: number;
    _end: number;
    _inversed: boolean;
    protected _minSize: number;
    /**
     * Chart the renderer is used in.
     */
    chart: XYChart | undefined;
    protected _lc: number;
    protected _ls: number;
    protected _thumbDownPoint?: IPoint;
    protected _downStart?: number;
    protected _downEnd?: number;
    /**
     * @ignore
     */
    makeTick(dataItem: DataItem<IAxisDataItem>, themeTags: Array<string>): AxisTick;
    /**
     * A list of ticks in the axis.
     *
     * `ticks.template` can be used to configure ticks.
     *
     * @default new ListTemplate<AxisTick>
     */
    readonly ticks: ListTemplate<AxisTick>;
    /**
     * @ignore
     */
    makeGrid(dataItem: DataItem<IAxisDataItem>, themeTags: Array<string>): Grid;
    /**
     * A list of grid elements in the axis.
     *
     * `grid.template` can be used to configure grid.
     *
     * @default new ListTemplate<Grid>
     */
    readonly grid: ListTemplate<Grid>;
    /**
     * @ignore
     */
    makeAxisFill(dataItem: DataItem<IAxisDataItem>, themeTags: Array<string>): Grid;
    /**
     * A list of fills in the axis.
     *
     * `axisFills.template` can be used to configure axis fills.
     *
     * @default new ListTemplate<Graphics>
     */
    readonly axisFills: ListTemplate<Graphics>;
    /**
     * @ignore
     */
    makeLabel(dataItem: DataItem<IAxisDataItem>, themeTags: Array<string>): AxisLabel;
    /**
     * A list of labels in the axis.
     *
     * `labels.template` can be used to configure axis labels.
     *
     * @default new ListTemplate<AxisLabel>
     */
    readonly labels: ListTemplate<AxisLabel>;
    _settings: IAxisRendererSettings;
    _privateSettings: IAxisRendererPrivate;
    /**
     * An [[Axis]] renderer is for.
     */
    axis: Axis<this>;
    axisLength(): number;
    /**
     * @ignore
     */
    gridCount(): number;
    _updatePositions(): void;
    /**
     * @ignore
     */
    abstract updateLabel(_label?: AxisLabel, _position?: number, _endPosition?: number, _count?: number): void;
    /**
     * @ignore
     */
    abstract updateGrid(_grid?: Grid, _position?: number, _endPosition?: number): void;
    /**
     * @ignore
     */
    abstract updateTick(_grid?: AxisTick, _position?: number, _endPosition?: number, _count?: number): void;
    /**
     * @ignore
     */
    abstract updateFill(_fill?: Graphics, _position?: number, _endPosition?: number): void;
    /**
     * @ignore
     */
    abstract updateBullet(_bullet?: AxisBullet, _position?: number, _endPosition?: number): void;
    /**
     * @ignore
     */
    abstract positionToPoint(_position: number): IPoint;
    readonly thumb?: Graphics;
    protected _afterNew(): void;
    _beforeChanged(): void;
    _changed(): void;
    protected _handleThumbDown(event: ISpritePointerEvent): void;
    protected _handleThumbUp(_event: ISpritePointerEvent): void;
    protected _handleThumbMove(event: ISpritePointerEvent): void;
    protected _getPan(_point1: IPoint, _point2: IPoint): number;
    /**
     * Converts relative position (0-1) on axis to a pixel coordinate.
     *
     * @param position  Position (0-1)
     * @return Coordinate (px)
     */
    positionToCoordinate(position: number): number;
    /**
     * @ignore
     */
    abstract positionTooltip(_tooltip: Tooltip, _position: number): void;
    /**
     * @ignore
     */
    updateTooltipBounds(_tooltip: Tooltip): void;
    _updateSize(): void;
    /**
     * @ignore
     */
    toAxisPosition(position: number): number;
    /**
     * @ignore
     */
    toGlobalPosition(position: number): number;
    /**
     * @ignore
     */
    fixPosition(position: number): number;
    /**
     * @ignore
     */
    _updateLC(): void;
    protected toggleVisibility(sprite: Sprite, position: number, minPosition: number, maxPosition: number): void;
    protected _positionTooltip(tooltip: Tooltip, point: IPoint): void;
    processAxis(): void;
}
//# sourceMappingURL=AxisRenderer.d.ts.map
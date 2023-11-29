import { AxisRenderer, IAxisRendererSettings, IAxisRendererPrivate } from "./AxisRenderer";
import type { IPoint } from "../../../core/util/IPoint";
import type { Graphics } from "../../../core/render/Graphics";
import type { AxisLabel } from "./AxisLabel";
import type { AxisBullet } from "./AxisBullet";
import type { Grid } from "./Grid";
import type { AxisTick } from "./AxisTick";
import type { Tooltip } from "../../../core/render/Tooltip";
import type { Template } from "../../../core/util/Template";
import { Rectangle } from "../../../core/render/Rectangle";
export interface IAxisRendererYSettings extends IAxisRendererSettings {
    /**
     * If set to `true` the axis will be drawn on the opposite side of the plot
     * area.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Axis_position} for more info
     * @default false
     */
    opposite?: boolean;
    /**
     * If set to `true`, all axis elements (ticks, labels) will be drawn inside
     * plot area.
     *
     * @default false
     */
    inside?: boolean;
}
export interface IAxisRendererYPrivate extends IAxisRendererPrivate {
}
/**
 * Used to render vertical axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/#Axis_renderer} for more info
 * @important
 */
export declare class AxisRendererY extends AxisRenderer {
    static className: string;
    static classNames: Array<string>;
    _settings: IAxisRendererYSettings;
    _privateSettings: IAxisRendererYPrivate;
    readonly labelTemplate: Template<AxisLabel>;
    protected _downY?: number;
    thumb: Rectangle;
    _afterNew(): void;
    protected _getPan(point1: IPoint, point2: IPoint): number;
    _changed(): void;
    /**
     * @ignore
     */
    processAxis(): void;
    _updatePositions(): void;
    /**
     * @ignore
     */
    axisLength(): number;
    /**
     * Converts axis relative position to actual coordinate in pixels.
     *
     * @param   position  Position
     * @return            Point
     */
    positionToPoint(position: number): IPoint;
    /**
     * @ignore
     */
    updateLabel(label?: AxisLabel, position?: number, endPosition?: number, count?: number): void;
    /**
     * @ignore
     */
    updateGrid(grid?: Grid, position?: number, endPosition?: number): void;
    /**
     * @ignore
     */
    updateTick(tick?: AxisTick, position?: number, endPosition?: number, count?: number): void;
    /**
     * @ignore
     */
    updateBullet(bullet?: AxisBullet, position?: number, endPosition?: number): void;
    /**
     * @ignore
     */
    updateFill(fill?: Graphics, position?: number, endPosition?: number): void;
    protected fillDrawMethod(fill: Graphics, y0: number, y1: number): void;
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
    positionTooltip(tooltip: Tooltip, position: number): void;
    /**
     * @ignore
     */
    updateTooltipBounds(tooltip: Tooltip): void;
    /**
     * @ignore
     */
    _updateLC(): void;
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
}
//# sourceMappingURL=AxisRendererY.d.ts.map
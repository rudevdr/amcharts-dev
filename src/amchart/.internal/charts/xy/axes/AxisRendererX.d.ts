import { AxisRenderer, IAxisRendererSettings, IAxisRendererPrivate } from "./AxisRenderer";
import type { IPoint } from "../../../core/util/IPoint";
import type { AxisLabel } from "./AxisLabel";
import type { Grid } from "./Grid";
import type { AxisTick } from "./AxisTick";
import type { Graphics } from "../../../core/render/Graphics";
import type { Tooltip } from "../../../core/render/Tooltip";
import type { Template } from "../../../core/util/Template";
import type { AxisBullet } from "./AxisBullet";
import { Rectangle } from "../../../core/render/Rectangle";
export interface IAxisRendererXSettings extends IAxisRendererSettings {
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
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Labels_ticks_inside_plot_area} for more info
     * @default false
     */
    inside?: boolean;
}
export interface IAxisRendererXPrivate extends IAxisRendererPrivate {
}
/**
 * Used to render horizontal axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/#Axis_renderer} for more info
 * @important
 */
export declare class AxisRendererX extends AxisRenderer {
    static className: string;
    static classNames: Array<string>;
    _settings: IAxisRendererXSettings;
    _privateSettings: IAxisRendererXPrivate;
    readonly labelTemplate: Template<AxisLabel>;
    thumb: Rectangle;
    _afterNew(): void;
    _changed(): void;
    protected _getPan(point1: IPoint, point2: IPoint): number;
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
    _updateLC(): void;
    /**
     * @ignore
     */
    _updatePositions(): void;
    /**
     * @ignore
     */
    processAxis(): void;
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
    updateTick(tick?: AxisTick, position?: number, endPosition?: number, count?: number): void;
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
    updateBullet(bullet?: AxisBullet, position?: number, endPosition?: number): void;
    /**
     * @ignore
     */
    updateFill(fill?: Graphics, position?: number, endPosition?: number): void;
    protected fillDrawMethod(fill: Graphics, x0: number, x1: number): void;
    /**
     * @ignore
     */
    positionTooltip(tooltip: Tooltip, position: number): void;
    /**
     * @ignore
     */
    updateTooltipBounds(tooltip: Tooltip): void;
}
//# sourceMappingURL=AxisRendererX.d.ts.map
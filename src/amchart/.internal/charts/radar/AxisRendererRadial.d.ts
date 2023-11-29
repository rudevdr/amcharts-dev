import type { RadarChart } from "./RadarChart";
import type { Grid } from "../xy/axes/Grid";
import type { IPoint } from "../../core/util/IPoint";
import type { Graphics } from "../../core/render/Graphics";
import type { AxisTick } from "../xy/axes/AxisTick";
import type { AxisBullet } from "../xy/axes/AxisBullet";
import type { Tooltip } from "../../core/render/Tooltip";
import { AxisRenderer, IAxisRendererSettings, IAxisRendererPrivate } from "../xy/axes/AxisRenderer";
import { Percent } from "../../core/util/Percent";
import { AxisLabelRadial } from "../xy/axes/AxisLabelRadial";
import { ListTemplate } from "../../core/util/List";
export interface IAxisRendererRadialSettings extends IAxisRendererSettings {
    /**
     * Outer radius of the axis.
     *
     * If set in percent, it will be relative to chart's own `radius`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/radar-axes/#Axis_radii_and_angles} for more info
     */
    radius?: number | Percent;
    /**
     * Inner radius of the axis.
     *
     * If set in percent, it will be relative to chart's own `innerRadius`.
     *
     * If value is negative, inner radius will be calculated from the outer edge.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/radar-axes/#Axis_radii_and_angles} for more info
     */
    innerRadius?: number | Percent;
    /**
     * Series start angle.
     *
     * If not set, will use chart's `startAngle.`
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/radar-axes/#Axis_radii_and_angles} for more info
     */
    startAngle?: number;
    /**
     * Series end angle.
     *
     * If not set, will use chart's `endAngle.`
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/radar-axes/#Axis_radii_and_angles} for more info
     */
    endAngle?: number;
    /**
     * @todo am: needs description
     */
    axisAngle?: number;
}
export interface IAxisRendererRadialPrivate extends IAxisRendererPrivate {
    /**
     * Actual radius of the label in pixels.
     */
    radius?: number;
    /**
     * Actual inner radius of the label in pixels.
     */
    innerRadius?: number;
    /**
     * Actual start angle of the label in degrees.
     */
    startAngle?: number;
    /**
     * Actual end angle of the label in degrees.
     */
    endAngle?: number;
}
/**
 * Renderer for radial axes.
 */
export declare class AxisRendererRadial extends AxisRenderer {
    /**
     * Chart this renderer is for.
     */
    chart: RadarChart | undefined;
    static className: string;
    static classNames: Array<string>;
    _settings: IAxisRendererRadialSettings;
    _privateSettings: IAxisRendererRadialPrivate;
    protected _fillGenerator: import("d3-shape").Arc<any, import("d3-shape").DefaultArcObject>;
    /**
     * A [[TemplateList]] with all the labels attached to the axis.
     *
     * `labels.template` can be used to configure appearance of the labels.
     *
     * @default new ListTemplate<AxisLabelRadial>
     */
    readonly labels: ListTemplate<AxisLabelRadial>;
    _afterNew(): void;
    _changed(): void;
    /**
     * @ignore
     */
    processAxis(): void;
    /**
     * @ignore
     */
    updateLayout(): void;
    /**
     * @ignore
     */
    updateGrid(grid?: Grid, position?: number, endPosition?: number): void;
    protected _handleOpposite(): void;
    /**
     * Converts relative position to X/Y point.
     *
     * @param   position  Position
     * @return            Point
     */
    positionToPoint(position: number): IPoint;
    /**
     * @ignore
     */
    updateLabel(label?: AxisLabelRadial, position?: number, endPosition?: number, count?: number): void;
    protected fillDrawMethod(fill: Graphics, y0: number, y1: number): void;
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
    /**
     * Returns axis length in pixels.
     *
     * @return Length
     */
    axisLength(): number;
    /**
     * @ignore
     */
    updateTooltipBounds(_tooltip: Tooltip): void;
    /**
     * Converts relative position to pixels.
     *
     * @param   position  Position
     * @return            Pixels
     */
    positionToCoordinate(position: number): number;
    /**
     * @ignore
     */
    positionTooltip(tooltip: Tooltip, position: number): void;
}
//# sourceMappingURL=AxisRendererRadial.d.ts.map
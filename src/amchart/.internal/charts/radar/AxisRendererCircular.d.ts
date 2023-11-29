import type { RadarChart } from "./RadarChart";
import type { Grid } from "../xy/axes/Grid";
import type { IPoint } from "../../core/util/IPoint";
import type { Graphics } from "../../core/render/Graphics";
import type { AxisTick } from "../xy/axes/AxisTick";
import type { AxisBullet } from "../xy/axes/AxisBullet";
import type { Tooltip } from "../../core/render/Tooltip";
import { Slice } from "../../core/render/Slice";
import { AxisRenderer, IAxisRendererSettings, IAxisRendererPrivate } from "../xy/axes/AxisRenderer";
import { AxisLabelRadial } from "../xy/axes/AxisLabelRadial";
import { Percent } from "../../core/util/Percent";
import { ListTemplate } from "../../core/util/List";
export interface IAxisRendererCircularSettings extends IAxisRendererSettings {
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
export interface IAxisRendererCircularPrivate extends IAxisRendererPrivate {
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
 * Renderer for circular axes.
 */
export declare class AxisRendererCircular extends AxisRenderer {
    /**
     * Chart this renderer is for.
     */
    chart: RadarChart | undefined;
    /**
     * A list of labels in the axis.
     *
     * `labels.template` can be used to configure labels.
     *
     * @default new ListTemplate<AxisLabelRadial>
     */
    readonly labels: ListTemplate<AxisLabelRadial>;
    /**
     * A list of fills in the axis.
     *
     * `axisFills.template` can be used to configure axis fills.
     *
     * @default new ListTemplate<Slice>
     */
    readonly axisFills: ListTemplate<Slice>;
    static className: string;
    static classNames: Array<string>;
    _settings: IAxisRendererCircularSettings;
    _privateSettings: IAxisRendererCircularPrivate;
    protected _fillGenerator: import("d3-shape").Arc<any, import("d3-shape").DefaultArcObject>;
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
    /**
     * Converts relative position to angle.
     *
     * @param   position  Position
     * @return            Angle
     */
    positionToAngle(position: number): number;
    protected _handleOpposite(): void;
    /**
     * Converts relative position to an X/Y coordinate.
     *
     * @param   position  Position
     * @return            Point
     */
    positionToPoint(position: number): IPoint;
    /**
     * @ignore
     */
    updateLabel(label?: AxisLabelRadial, position?: number, endPosition?: number, count?: number): void;
    /**
     * @ignore
     */
    fillDrawMethod(fill: Graphics, startAngle?: number, endAngle?: number): void;
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
    updateFill(fill?: Slice, position?: number, endPosition?: number): void;
    /**
     * @ignore
     */
    fitAngle(angle: number): number;
    /**
     * Returns axis length in pixels.
     *
     * @return Length
     */
    axisLength(): number;
    /**
     * @ignore
     */
    positionTooltip(tooltip: Tooltip, position: number): void;
    /**
     * @ignore
     */
    updateTooltipBounds(_tooltip: Tooltip): void;
}
//# sourceMappingURL=AxisRendererCircular.d.ts.map
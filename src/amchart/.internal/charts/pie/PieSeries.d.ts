import type { DataItem } from "../../core/render/Component";
import type { PieChart } from "./PieChart";
import { PercentSeries, IPercentSeriesSettings, IPercentSeriesDataItem, IPercentSeriesPrivate } from "../percent/PercentSeries";
import { Slice } from "../../core/render/Slice";
import { RadialLabel } from "../../core/render/RadialLabel";
import { ListTemplate } from "../../core/util/List";
import { Percent } from "../../core/util/Percent";
import type { Bullet } from "../../core/render/Bullet";
export interface IPieSeriesDataItem extends IPercentSeriesDataItem {
    slice: Slice;
    label: RadialLabel;
}
export interface IPieSeriesSettings extends IPercentSeriesSettings {
    /**
     * Radius of the series in pixels or percent.
     */
    radius?: Percent | number;
    /**
     * Radius of the series in pixels or percent.
     *
     * Setting to negative number will mean pixels from outer radius.
     */
    innerRadius?: Percent | number;
    /**
     * Start angle of the series in degrees.
     *
     * @default -90
     */
    startAngle?: number;
    /**
     * End angle of the series in degrees.
     *
     * @default 270
     */
    endAngle?: number;
}
export interface IPieSeriesPrivate extends IPercentSeriesPrivate {
    /**
     * Actual radius of the series in pixels.
     */
    radius?: number;
}
/**
 * Creates a series for a [[PieChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/} for more info
 * @important
 */
export declare class PieSeries extends PercentSeries {
    chart: PieChart | undefined;
    static className: string;
    static classNames: Array<string>;
    _settings: IPieSeriesSettings;
    _privateSettings: IPieSeriesPrivate;
    _dataItemSettings: IPieSeriesDataItem;
    _sliceType: Slice;
    _labelType: RadialLabel;
    protected _makeSlices(): ListTemplate<this["_sliceType"]>;
    protected _makeLabels(): ListTemplate<this["_labelType"]>;
    protected _makeTicks(): ListTemplate<this["_tickType"]>;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _getNextUp(): number;
    protected _getNextDown(): number;
    _prepareChildren(): void;
    protected _updateTick(dataItem: DataItem<this["_dataItemSettings"]>): void;
    _positionBullet(bullet: Bullet): void;
}
//# sourceMappingURL=PieSeries.d.ts.map
import type { PercentSeries } from "./PercentSeries";
import { SerialChart, ISerialChartPrivate, ISerialChartSettings } from "../../core/render/SerialChart";
export interface IPercentChartSettings extends ISerialChartSettings {
}
export interface IPercentChartPrivate extends ISerialChartPrivate {
}
/**
 * Base class for [[PieChart]].
 *
 * Also used for percent-based series, like [[FunnelSeries]], [[PyramidSeries]], etc.
 *
 * @important
 */
export declare abstract class PercentChart extends SerialChart {
    static className: string;
    static classNames: Array<string>;
    _settings: IPercentChartSettings;
    _privateSettings: IPercentChartPrivate;
    _seriesType: PercentSeries;
    protected _afterNew(): void;
    protected _processSeries(series: this["_seriesType"]): void;
}
//# sourceMappingURL=PercentChart.d.ts.map
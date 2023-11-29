import type { Series } from "./Series";
import { Chart, IChartSettings, IChartPrivate, IChartEvents } from "./Chart";
import { Container } from "../../core/render/Container";
import { ListAutoDispose } from "../../core/util/List";
import type { ColorSet } from "../../core/util/ColorSet";
export interface ISerialChartSettings extends IChartSettings {
    /**
     * A [[ColorSet]] to use when asigning colors for series.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Series_colors} for more info
     */
    colors?: ColorSet;
}
export interface ISerialChartPrivate extends IChartPrivate {
}
export interface ISerialChartEvents extends IChartEvents {
}
/**
 * A base class for all series-based charts.
 */
export declare abstract class SerialChart extends Chart {
    static className: string;
    static classNames: Array<string>;
    _settings: ISerialChartSettings;
    _privateSettings: ISerialChartPrivate;
    _seriesType: Series;
    _events: ISerialChartEvents;
    /**
     * A [[Container]] where chart will store all series.
     *
     * @default Container.new()
     */
    readonly seriesContainer: Container;
    /**
     * A list of chart's series.
     */
    readonly series: ListAutoDispose<this["_seriesType"]>;
    protected _afterNew(): void;
    protected _processSeries(series: this["_seriesType"]): void;
    protected _removeSeries(series: this["_seriesType"]): void;
}
//# sourceMappingURL=SerialChart.d.ts.map
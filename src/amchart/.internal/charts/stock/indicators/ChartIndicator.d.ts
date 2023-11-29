import type { XYSeries } from "../../xy/series/XYSeries";
import type { AxisRenderer } from "../../xy/axes/AxisRenderer";
import { Indicator, IIndicatorSettings, IIndicatorPrivate, IIndicatorEvents } from "./Indicator";
import { StockPanel } from "../StockPanel";
import { XYCursor } from "../../xy/XYCursor";
import { DateAxis } from "../../xy/axes/DateAxis";
import { ValueAxis } from "../../xy/axes/ValueAxis";
import { StockLegend } from "../StockLegend";
export interface IChartIndicatorSettings extends IIndicatorSettings {
}
export interface IChartIndicatorPrivate extends IIndicatorPrivate {
}
export interface IChartIndicatorEvents extends IIndicatorEvents {
}
/**
 * A base class for chart-based [[StockChart]] indicators.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare abstract class ChartIndicator extends Indicator {
    static className: string;
    static classNames: Array<string>;
    _settings: IChartIndicatorSettings;
    _privateSettings: IChartIndicatorPrivate;
    _events: IChartIndicatorEvents;
    panel: StockPanel;
    xAxis: DateAxis<AxisRenderer>;
    yAxis: ValueAxis<AxisRenderer>;
    cursor: XYCursor;
    legend: StockLegend;
    protected _themeTag?: string;
    protected _themeTags: Array<string>;
    protected _afterNew(): void;
    protected _dispose(): void;
    hide(duration?: number): Promise<any>;
    show(duration?: number): Promise<any>;
    protected abstract _createSeries(): XYSeries;
}
//# sourceMappingURL=ChartIndicator.d.ts.map
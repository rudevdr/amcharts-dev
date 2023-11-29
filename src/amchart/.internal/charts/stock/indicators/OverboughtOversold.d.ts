import type { IIndicatorEditableSetting } from "./Indicator";
import type { IValueAxisDataItem } from "../../xy/axes/ValueAxis";
import type { DataItem } from "../../../core/render/Component";
import type { Color } from "../../../core/util/Color";
import { ChartIndicator, IChartIndicatorSettings, IChartIndicatorPrivate, IChartIndicatorEvents } from "./ChartIndicator";
import { LineSeries, ILineSeriesAxisRange } from "../../xy/series/LineSeries";
import { Button } from "../../../core/render/Button";
export interface IOverboughtOversoldSettings extends IChartIndicatorSettings {
    /**
     * A value for "overbought" threshold.
     */
    overBought?: number;
    /**
     * A value for "oversold" threshold.
     */
    overSold?: number;
    /**
     * A color for "overbought" section.
     */
    overBoughtColor?: Color;
    /**
     * A color for "oversold" section.
     */
    overSoldColor?: Color;
}
export interface IOverboughtOversoldPrivate extends IChartIndicatorPrivate {
}
export interface IOverboughtOversoldEvents extends IChartIndicatorEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class OverboughtOversold extends ChartIndicator {
    static className: string;
    static classNames: Array<string>;
    _settings: IOverboughtOversoldSettings;
    _privateSettings: IOverboughtOversoldPrivate;
    _events: IOverboughtOversoldEvents;
    overBought: DataItem<IValueAxisDataItem>;
    middle: DataItem<IValueAxisDataItem>;
    overSold: DataItem<IValueAxisDataItem>;
    overSoldRange: ILineSeriesAxisRange;
    overBoughtRange: ILineSeriesAxisRange;
    /**
     * Indicator series.
     */
    series: LineSeries;
    _editableSettings: IIndicatorEditableSetting[];
    protected _afterNew(): void;
    protected _updateRange(button: Button, key: "overBought" | "overSold"): void;
    _createSeries(): LineSeries;
    _prepareChildren(): void;
    _updateChildren(): void;
}
//# sourceMappingURL=OverboughtOversold.d.ts.map
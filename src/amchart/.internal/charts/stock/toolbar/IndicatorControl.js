import { Indicator } from "../indicators/Indicator";
import { AccumulationDistribution } from "../indicators/AccumulationDistribution";
import { AccumulativeSwingIndex } from "../indicators/AccumulativeSwingIndex";
import { Aroon } from "../indicators/Aroon";
import { AwesomeOscillator } from "../indicators/AwesomeOscillator";
import { BollingerBands } from "../indicators/BollingerBands";
import { ChaikinMoneyFlow } from "../indicators/ChaikinMoneyFlow";
import { ChaikinOscillator } from "../indicators/ChaikinOscillator";
import { CommodityChannelIndex } from "../indicators/CommodityChannelIndex";
import { DisparityIndex } from "../indicators/DisparityIndex";
import { MACD } from "../indicators/MACD";
import { MovingAverage } from "../indicators/MovingAverage";
import { MovingAverageDeviation } from "../indicators/MovingAverageDeviation";
import { MovingAverageEnvelope } from "../indicators/MovingAverageEnvelope";
import { StandardDeviation } from "../indicators/StandardDeviation";
import { TypicalPrice } from "../indicators/TypicalPrice";
import { MedianPrice } from "../indicators/MedianPrice";
import { OnBalanceVolume } from "../indicators/OnBalanceVolume";
import { Momentum } from "../indicators/Momentum";
import { RelativeStrengthIndex } from "../indicators/RelativeStrengthIndex";
import { StochasticMomentumIndex } from "../indicators/StochasticMomentumIndex";
import { StochasticOscillator } from "../indicators/StochasticOscillator";
import { WilliamsR } from "../indicators/WilliamsR";
import { Trix } from "../indicators/Trix";
import { Volume } from "../indicators/Volume";
import { VWAP } from "../indicators/VWAP";
import { ZigZag } from "../indicators/ZigZag";
import { JsonParser } from "../../../plugins/json/Json";
import { Serializer } from "../../../plugins/json/Serializer";
//import type { IDisposer } from "../../../core/util/Disposer";
import { DropdownListControl } from "./DropdownListControl";
import { StockIcons } from "./StockIcons";
import * as $array from "../../../core/util/Array";
import * as $type from "../../../core/util/Type";
/**
 * A [[StockToolbar]] control for adding indicators to a [[StockChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/indicator-control/} for more info
 */
export class IndicatorControl extends DropdownListControl {
    _afterNew() {
        // Do parent stuff
        super._afterNew();
        // Create list of tools
        const list = this.getPrivate("dropdown");
        this.setPrivate("list", list);
        list.events.on("invoked", (ev) => {
            const indicator = this.addIndicator(ev.item.id);
            if (this.events.isEnabled("selected") && indicator) {
                this.events.dispatch("selected", {
                    type: "selected",
                    target: this,
                    indicator: indicator,
                    item: ev.item
                });
            }
        });
        list.events.on("closed", (_ev) => {
            this.set("active", false);
        });
        this.on("active", (active) => {
            if (active) {
                this.setTimeout(() => list.show(), 10);
            }
            else {
                list.hide();
            }
        });
        const button = this.getPrivate("button");
        button.className = button.className + " am5stock-control-dropdown";
        this._initList();
        // Re-nit list if volume series is added or removed so that we can show/hide
        // volume-dependent indicators
        this.get("stockChart").on("volumeSeries", () => this._initList());
    }
    _initList() {
        const list = this.getPrivate("list");
        const indicators = this.get("indicators");
        const items = [];
        $array.each(indicators, (indicator) => {
            if ($type.isObject(indicator)) {
                if (this.supportsIndicator(indicator.id)) {
                    items.push({
                        id: indicator.id,
                        label: indicator.name
                    });
                }
            }
            else {
                if (this.supportsIndicator(indicator)) {
                    items.push({
                        id: indicator,
                        label: this._root.language.translateAny(indicator)
                    });
                }
            }
        });
        list.set("items", items);
    }
    /**
     * Returns `true` if the indicator is supported in current chart setup.
     *
     * @param   indicatorId  Indicator ID
     * @return               Supported?
     */
    supportsIndicator(indicatorId) {
        const stockChart = this.get("stockChart");
        const volumeIndicators = ["Chaikin Money Flow", "Chaikin Oscillator", "On Balance Volume", "Volume", "VWAP"];
        return (stockChart.get("volumeSeries") || volumeIndicators.indexOf(indicatorId) === -1) ? true : false;
    }
    _getDefaultIcon() {
        return StockIcons.getIcon("Indicator");
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("indicators")) {
            this._initList();
        }
    }
    /**
     * Creates a specific indicator, adds it to chart, and returns the instance.
     *
     * @param   indicatorId  Indicator ID
     * @return               Indicator instance
     */
    addIndicator(indicatorId) {
        if (!this.supportsIndicator(indicatorId)) {
            return;
        }
        const stockChart = this.get("stockChart");
        let indicator;
        const stockSeries = stockChart.get("stockSeries");
        const volumeSeries = stockChart.get("volumeSeries");
        const legend = this.get("legend");
        switch (indicatorId) {
            case "Accumulation Distribution":
                indicator = AccumulationDistribution.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    volumeSeries: volumeSeries,
                    legend: legend
                });
                break;
            case "Accumulative Swing Index":
                indicator = AccumulativeSwingIndex.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    legend: legend
                });
                break;
            case "Aroon":
                indicator = Aroon.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    legend: legend
                });
                break;
            case "Awesome Oscillator":
                indicator = AwesomeOscillator.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    legend: legend
                });
                break;
            case "Bollinger Bands":
                indicator = BollingerBands.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    legend: legend
                });
                break;
            case "Chaikin Money Flow":
                indicator = ChaikinMoneyFlow.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    volumeSeries: volumeSeries,
                    legend: legend
                });
                break;
            case "Chaikin Oscillator":
                indicator = ChaikinOscillator.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    volumeSeries: volumeSeries,
                    legend: legend
                });
                break;
            case "Commodity Channel Index":
                indicator = CommodityChannelIndex.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries
                });
                break;
            case "Disparity Index":
                indicator = DisparityIndex.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries
                });
                break;
            case "MACD":
                indicator = MACD.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    legend: legend
                });
                break;
            case "Median Price":
                indicator = MedianPrice.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    legend: legend
                });
                break;
            case "Momentum":
                indicator = Momentum.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries
                });
                break;
            case "Moving Average":
                indicator = MovingAverage.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    legend: legend
                });
                break;
            case "Moving Average Deviation":
                indicator = MovingAverageDeviation.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    legend: legend
                });
                break;
            case "Moving Average Envelope":
                indicator = MovingAverageEnvelope.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    legend: legend
                });
                break;
            case "Standard Deviation":
                indicator = StandardDeviation.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    legend: legend
                });
                break;
            case "Trix":
                indicator = Trix.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    legend: legend
                });
                break;
            case "Typical Price":
                indicator = TypicalPrice.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    legend: legend
                });
                break;
            case "On Balance Volume":
                indicator = OnBalanceVolume.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    volumeSeries: volumeSeries,
                    legend: legend
                });
                break;
            case "Relative Strength Index":
                indicator = RelativeStrengthIndex.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries
                });
                break;
            case "Stochastic Momentum Index":
                indicator = StochasticMomentumIndex.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries
                });
                break;
            case "Stochastic Oscillator":
                indicator = StochasticOscillator.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries
                });
                break;
            case "Williams R":
                indicator = WilliamsR.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries
                });
                break;
            case "Volume":
                indicator = Volume.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    volumeSeries: volumeSeries
                });
                break;
            case "VWAP":
                indicator = VWAP.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    volumeSeries: volumeSeries,
                    legend: legend
                });
                break;
            case "ZigZag":
                indicator = ZigZag.new(this.root, {
                    stockChart: stockChart,
                    stockSeries: stockSeries,
                    legend: legend
                });
                break;
        }
        if (!indicator) {
            // Try searching in the list
            $array.eachContinue(this.get("indicators", []), (item) => {
                if ($type.isObject(item) && item.id == indicatorId) {
                    indicator = item.callback.call(this);
                    return false;
                }
                return true;
            });
        }
        if (indicator) {
            stockChart.indicators.push(indicator);
            if (indicator._editableSettings.length) {
                const modal = stockChart.getPrivate("settingsModal");
                modal.events.once("done", (ev) => {
                    if (indicator) {
                        if (!ev.settings) {
                            indicator.dispose();
                        }
                    }
                });
                modal.openIndicator(indicator);
            }
        }
        return indicator;
    }
    /**
     * Serializes all available indicators into an array of simple objects or
     * JSON.
     *
     * `output` parameter can either be `"object"` or `"string"` (default).
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/serializing-indicators-annotations/} for more info
     * @since 5.3.0
     * @param   output Output format
     * @param   indent Line indent in JSON
     * @return         Serialized indicators
     */
    serializeIndicators(output = "string", indent) {
        const res = [];
        const stockChart = this.get("stockChart");
        stockChart.indicators.each((indicator) => {
            const serializer = Serializer.new(this._root, {
                excludeSettings: ["stockChart", "stockSeries", "volumeSeries", "legend"]
            });
            // Panel
            const json = {};
            // Series and legend
            if (indicator.get("stockSeries")) {
                json.__stockSeries = true;
            }
            if (indicator.get("volumeSeries")) {
                json.__volumeSeries = true;
            }
            const legend = indicator.get("legend");
            if (legend) {
                legend._walkParents((parent) => {
                    if (parent.isType("StockPanel")) {
                        json.__legendIndex = stockChart.panels.indexOf(parent);
                    }
                });
            }
            // Serialize
            json.__indicator = serializer.serialize(indicator, 0);
            res.push(json);
        });
        return output == "object" ? res : JSON.stringify(res, undefined, indent);
    }
    /**
     * Parses data serialized with `serializeIndicators()` and adds indicators to
     * the chart.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/serializing-indicators-annotations/} for more info
     * @since 5.3.0
     * @param  data Serialized data
     */
    unserializeIndicators(data) {
        const stockChart = this.get("stockChart");
        if ($type.isString(data)) {
            data = JSON.parse(data);
        }
        $array.each(data, (indicator) => {
            // Populate
            if (!indicator.__indicator.settings) {
                indicator.__indicator.settings = {};
            }
            indicator.__indicator.settings.stockChart = stockChart;
            if (indicator.__stockSeries && !indicator.__indicator.settings.stockSeries) {
                indicator.__indicator.settings.stockSeries = stockChart.get("stockSeries");
            }
            if (indicator.__volumeSeries && !indicator.__indicator.settings.volumeSeries) {
                indicator.__indicator.settings.volumeSeries = stockChart.get("volumeSeries");
            }
            if (indicator.__legendIndex !== undefined && !indicator.__indicator.settings.legend) {
                // Find a legend
                const panel = stockChart.panels.getIndex(indicator.__legendIndex);
                if (panel) {
                    panel.walkChildren((child) => {
                        if (child.isType("StockLegend")) {
                            indicator.__indicator.settings.legend = child;
                        }
                    });
                }
            }
            // Parse
            JsonParser.new(this._root).parse(indicator.__indicator).then((indicator) => {
                if (indicator instanceof Indicator) {
                    stockChart.indicators.push(indicator);
                }
            });
        });
    }
}
Object.defineProperty(IndicatorControl, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "IndicatorControl"
});
Object.defineProperty(IndicatorControl, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: DropdownListControl.classNames.concat([IndicatorControl.className])
});
//# sourceMappingURL=IndicatorControl.js.map
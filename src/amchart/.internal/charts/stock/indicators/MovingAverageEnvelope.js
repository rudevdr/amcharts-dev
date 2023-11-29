import { __awaiter } from "tslib";
import { MovingAverage } from "./MovingAverage";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class MovingAverageEnvelope extends MovingAverage {
    constructor() {
        super(...arguments);
        /**
         * Indicator series for the upper band.
         */
        Object.defineProperty(this, "upperBandSeries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Indicator series for the lower band.
         */
        Object.defineProperty(this, "lowerBandSeries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_editableSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [{
                    key: "period",
                    name: this.root.language.translateAny("Period"),
                    type: "number"
                }, {
                    key: "type",
                    name: this.root.language.translateAny("Type"),
                    type: "dropdown",
                    options: ["simple", "weighted", "exponential", "dema", "tema"]
                }, {
                    key: "field",
                    name: this.root.language.translateAny("Field"),
                    type: "dropdown",
                    options: ["open", "close", "low", "high", "hl/2", "hlc/3", "hlcc/4", "ohlc/4"]
                }, {
                    key: "shiftType",
                    name: this.root.language.translateAny("Shift type"),
                    type: "dropdown",
                    options: ["percent", "points"]
                }, {
                    key: "shift",
                    name: this.root.language.translateAny("Shift"),
                    type: "number"
                }, {
                    key: "offset",
                    name: this.root.language.translateAny("Offset"),
                    type: "number"
                }, {
                    key: "upperColor",
                    name: this.root.language.translateAny("Top"),
                    type: "color"
                }, {
                    key: "seriesColor",
                    name: this.root.language.translateAny("Median"),
                    type: "color"
                }, {
                    key: "lowerColor",
                    name: this.root.language.translateAny("Bottom"),
                    type: "color"
                }]
        });
    }
    _afterNew() {
        const stockSeries = this.get("stockSeries");
        const chart = stockSeries.chart;
        if (chart) {
            const upperBandSeries = chart.series.push(LineSeries.new(this._root, {
                valueXField: "valueX",
                valueYField: "upper",
                openValueYField: "lower",
                xAxis: stockSeries.get("xAxis"),
                yAxis: stockSeries.get("yAxis"),
                groupDataDisabled: true,
                calculateAggregates: true,
                themeTags: ["indicator", "movingaverageenvelope", "upper"]
            }));
            upperBandSeries.fills.template.set("visible", true);
            upperBandSeries.setPrivate("baseValueSeries", stockSeries);
            this.upperBandSeries = upperBandSeries;
            const lowerBandSeries = chart.series.push(LineSeries.new(this._root, {
                valueXField: "valueX",
                valueYField: "lower",
                xAxis: stockSeries.get("xAxis"),
                yAxis: stockSeries.get("yAxis"),
                groupDataDisabled: true,
                calculateAggregates: true,
                themeTags: ["indicator", "movingaverageenvelope", "lower"]
            }));
            lowerBandSeries.setPrivate("baseValueSeries", stockSeries);
            this.lowerBandSeries = lowerBandSeries;
        }
        super._afterNew();
        this.series.addTag("movingaverageenvelope");
        this.series._applyThemes();
    }
    _updateChildren() {
        super._updateChildren();
        if (this.isDirty("upperColor")) {
            const color = this.get("upperColor");
            const upperBandSeries = this.upperBandSeries;
            upperBandSeries.set("stroke", color);
            upperBandSeries.set("fill", color);
            upperBandSeries.strokes.template.set("stroke", color);
            this._updateSeriesColor(upperBandSeries, color, "upperColor");
        }
        if (this.isDirty("lowerColor")) {
            const color = this.get("lowerColor");
            const lowerBandSeries = this.lowerBandSeries;
            lowerBandSeries.set("stroke", color);
            lowerBandSeries.strokes.template.set("stroke", color);
            this._updateSeriesColor(lowerBandSeries, color, "lowerColor");
        }
    }
    _prepareChildren() {
        if (this.isDirty("shiftType") || this.isDirty("shift")) {
            this._dataDirty = true;
            this.setCustomData("shift", this.get("shift"));
            this.setCustomData("shiftType", this.get("shiftType"));
        }
        super._prepareChildren();
    }
    /**
     * @ignore
     */
    prepareData() {
        super.prepareData();
        if (this.series) {
            let smaData = this.series.data.values;
            let shift = Number(this.get("shift", 5));
            let shiftType = this.get("shiftType");
            $array.each(smaData, (dataItem) => {
                let value = dataItem.ma;
                if (value != null) {
                    let upper = value;
                    let lower = value;
                    if (shiftType == "points") {
                        upper += shift;
                        lower -= shift;
                    }
                    else {
                        upper += upper * shift / 100;
                        lower -= lower * shift / 100;
                    }
                    dataItem.upper = upper;
                    dataItem.lower = lower;
                }
            });
            this.upperBandSeries.data.setAll(smaData);
            this.lowerBandSeries.data.setAll(smaData);
        }
    }
    _dispose() {
        this.upperBandSeries.dispose();
        this.lowerBandSeries.dispose();
        super._dispose();
    }
    hide(duration) {
        const _super = Object.create(null, {
            hide: { get: () => super.hide }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all([
                _super.hide.call(this, duration),
                this.upperBandSeries.hide(duration),
                this.lowerBandSeries.hide(duration)
            ]);
        });
    }
    show(duration) {
        const _super = Object.create(null, {
            show: { get: () => super.show }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all([
                _super.show.call(this, duration),
                this.upperBandSeries.show(duration),
                this.lowerBandSeries.show(duration)
            ]);
        });
    }
}
Object.defineProperty(MovingAverageEnvelope, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "MovingAverageEnvelope"
});
Object.defineProperty(MovingAverageEnvelope, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: MovingAverage.classNames.concat([MovingAverageEnvelope.className])
});
//# sourceMappingURL=MovingAverageEnvelope.js.map
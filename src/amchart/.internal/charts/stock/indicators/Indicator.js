import { __awaiter } from "tslib";
import { Container } from "../../../core/render/Container";
import { LineSeries } from "../../xy/series/LineSeries";
import { BaseColumnSeries } from "../../xy/series/BaseColumnSeries";
import { MultiDisposer } from "../../../core/util/Disposer";
import * as $array from "../../../core/util/Array";
/**
 * Base class for [[StockChart]] indicators.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class Indicator extends Container {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_editableSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "series", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_dataDirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_sDP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_vDP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isDirty("stockSeries") || this.isDirty("volumeSeries")) {
            this._dataDirty = true;
            const stockSeries = this.get("stockSeries");
            const previousS = this._prevSettings.stockSeries;
            if (previousS && this._sDP) {
                this._sDP.dispose();
            }
            if (stockSeries) {
                this._sDP = new MultiDisposer([
                    stockSeries.events.on("datavalidated", () => {
                        this.markDataDirty();
                    }),
                    stockSeries.events.on("datasetchanged", () => {
                        this.markDataDirty();
                    })
                ]);
            }
            const previousV = this._prevSettings.volumeSeries;
            if (previousV && this._vDP) {
                this._vDP.dispose();
            }
            const volumeSeries = this.get("volumeSeries");
            if (volumeSeries) {
                this._vDP = new MultiDisposer([
                    volumeSeries.events.on("datavalidated", () => {
                        this.markDataDirty();
                    }),
                    volumeSeries.events.on("datasetchanged", () => {
                        this.markDataDirty();
                    })
                ]);
            }
        }
        if (this.isDirty("field")) {
            if (this.get("field")) {
                this._dataDirty = true;
            }
        }
        if (this.isDirty("period")) {
            this._dataDirty = true;
            this.setCustomData("period", this.get("period"));
        }
        if (this._dataDirty) {
            this.prepareData();
            this._dataDirty = false;
        }
    }
    markDataDirty() {
        this._dataDirty = true;
        this.markDirty();
    }
    _updateChildren() {
        super._updateChildren();
        if (this.isDirty("seriesColor")) {
            this._updateSeriesColor(this.series, this.get("seriesColor"), "seriesColor");
        }
        this.setCustomData("period", this.get("period"));
        this.setCustomData("field", this.get("field"));
        this.setCustomData("name", this.get("name"));
        this.setCustomData("shortName", this.get("shortName"));
    }
    _dispose() {
        super._dispose();
        if (this._sDP) {
            this._sDP.dispose();
        }
        if (this._vDP) {
            this._vDP.dispose();
        }
        const series = this.series;
        if (series) {
            series.dispose();
        }
        const stockChart = this.get("stockChart");
        if (stockChart) {
            const legend = this.get("legend");
            if (legend) {
                const legendDataItem = series.get("legendDataItem");
                if (legendDataItem) {
                    legend.disposeDataItem(legendDataItem);
                }
            }
            stockChart.indicators.removeValue(this);
        }
    }
    hide(duration) {
        const _super = Object.create(null, {
            hide: { get: () => super.hide }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all([
                _super.hide.call(this, duration),
                this.series.hide(duration)
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
                this.series.show(duration)
            ]);
        });
    }
    _handleLegend(series) {
        const legend = this.get("legend");
        if (legend) {
            legend.data.push(series);
            const legendDataItem = legend.dataItems[legend.dataItems.length - 1];
            legendDataItem.get("marker").set("forceHidden", true);
            const closeButton = legendDataItem.get("closeButton");
            closeButton.set("forceHidden", false);
            closeButton.events.on("click", () => {
                this.dispose();
            });
            const settingsButton = legendDataItem.get("settingsButton");
            settingsButton.setPrivate("customData", this);
            const editableSettings = this._editableSettings;
            if (!editableSettings || editableSettings.length == 0) {
                settingsButton.set("forceHidden", true);
            }
        }
    }
    _updateSeriesColor(series, color, contextName) {
        if (series) {
            series.set("stroke", color);
            series.set("fill", color);
            if (series instanceof LineSeries) {
                series.strokes.template.set("stroke", color);
                series.fills.template.set("fill", color);
            }
            if (series instanceof BaseColumnSeries) {
                series.columns.template.setAll({ stroke: color, fill: color });
            }
            if (contextName && color) {
                this.setCustomData(contextName, color.toCSSHex());
            }
        }
    }
    setCustomData(name, value) {
        const customData = this.series.getPrivate("customData");
        if (customData) {
            customData[name] = value;
        }
    }
    /**
     * @ignore
     */
    prepareData() {
    }
    _getValue(dataItem) {
        const field = this.get("field");
        let o = dataItem.get("openValueY");
        let h = dataItem.get("highValueY");
        let l = dataItem.get("lowValueY");
        let c = dataItem.get("valueY");
        switch (field) {
            case "close":
                return c;
                break;
            case "open":
                return o;
                break;
            case "high":
                return h;
                break;
            case "low":
                return l;
                break;
            case "hl/2":
                return (h + l) / 2;
                break;
            case "hlc/3":
                return (h + l + c) / 3;
                break;
            case "hlcc/4":
                return (h + l + c + c) / 4;
                break;
            case "ohlc/4":
                return (o + h + l + c) / 4;
                break;
        }
    }
    /**
     * @ignore
     */
    _getDataArray(dataItems) {
        const data = [];
        $array.each(dataItems, (dataItem) => {
            data.push({ valueX: dataItem.get("valueX"), value_y: this._getValue(dataItem) });
        });
        return data;
    }
    /**
     * @ignore
     */
    _getTypicalPrice(dataItems) {
        const data = [];
        $array.each(dataItems, (dataItem) => {
            data.push({ valueX: dataItem.get("valueX"), value_y: (dataItem.get("valueY", 0) + dataItem.get("highValueY", 0) + dataItem.get("lowValueY", 0)) / 2 });
        });
        return data;
    }
    _sma(data, period, field, toField) {
        let i = 0;
        let index = 0;
        let ma = 0;
        $array.each(data, (dataItem) => {
            let value = dataItem[field];
            if (value != null) {
                i++;
                ma += value / period;
                if (i >= period) {
                    if (i > period) {
                        let valueToRemove = data[index - period][field];
                        if (valueToRemove != null) {
                            ma -= valueToRemove / period;
                        }
                    }
                    dataItem[toField] = ma;
                }
            }
            index++;
        });
    }
    _wma(data, period, field, toField) {
        let i = 0;
        let index = 0;
        let ma = 0;
        $array.each(data, (dataItem) => {
            let value = dataItem[field];
            if (value != null) {
                i++;
                if (i >= period) {
                    let sum = 0;
                    let m = 0;
                    let count = 0;
                    let k = 0;
                    for (let n = index; n >= 0; n--) {
                        let pValue = data[n][field];
                        if (pValue != null) {
                            sum += pValue * (period - m);
                            count += (period - m);
                            k++;
                        }
                        m++;
                        if (k == period) {
                            break;
                        }
                    }
                    ma = sum / count;
                    dataItem[toField] = ma;
                }
            }
            index++;
        });
    }
    _ema(data, period, field, toField) {
        let i = 0;
        let ma = 0;
        let multiplier = 2 / (1 + period);
        $array.each(data, (dataItem) => {
            let value = dataItem[field];
            if (value != null) {
                i++;
                if (i > period) {
                    ma = value * multiplier + ma * (1 - multiplier);
                    dataItem[toField] = ma;
                }
                else {
                    ma += value / period;
                    if (i == period) {
                        dataItem[toField] = ma;
                    }
                }
            }
        });
    }
    _dema(data, period, field, toField) {
        let i = 0;
        let ema2 = 0;
        let multiplier = 2 / (1 + period);
        this._ema(data, period, field, "ema");
        $array.each(data, (dataItem) => {
            let ema = dataItem.ema;
            if (ema != null) {
                i++;
                if (i > period) {
                    ema2 = ema * multiplier + ema2 * (1 - multiplier);
                    dataItem[toField] = 2 * ema - ema2;
                    dataItem.ema2 = ema2;
                }
                else {
                    ema2 += ema / period;
                    if (i == period) {
                        dataItem[toField] = 2 * ema - ema2;
                        dataItem.ema2 = ema2;
                    }
                }
            }
        });
    }
    _tema(data, period, field, toField) {
        let i = 0;
        let ema3 = 0;
        let multiplier = 2 / (1 + period);
        this._dema(data, period, field, "dema");
        $array.each(data, (dataItem) => {
            let ema = dataItem.ema;
            let ema2 = dataItem.ema2;
            if (ema2 != null) {
                i++;
                if (i > period) {
                    ema3 = ema2 * multiplier + ema3 * (1 - multiplier);
                    dataItem[toField] = 3 * ema - 3 * ema2 + ema3;
                }
                else {
                    ema3 += ema2 / period;
                    if (i == period) {
                        dataItem[toField] = 3 * ema - 3 * ema2 + ema3;
                    }
                }
            }
        });
    }
}
Object.defineProperty(Indicator, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Indicator"
});
Object.defineProperty(Indicator, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Container.classNames.concat([Indicator.className])
});
//# sourceMappingURL=Indicator.js.map
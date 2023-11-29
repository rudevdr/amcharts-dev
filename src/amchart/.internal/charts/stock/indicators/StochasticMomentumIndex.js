import { OverboughtOversold } from "./OverboughtOversold";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @since 5.5.3
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class StochasticMomentumIndex extends OverboughtOversold {
    constructor() {
        super(...arguments);
        /**
         * Indicator series.
         */
        Object.defineProperty(this, "emaSeries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        this._themeTags.push("stochasticmomentum");
        super._afterNew();
        this._editableSettings.unshift({
            key: "period",
            name: this.root.language.translateAny("K period"),
            type: "number"
        }, {
            key: "seriesColor",
            name: this.root.language.translateAny("K period"),
            type: "color"
        }, {
            key: "dPeriod",
            name: this.root.language.translateAny("D period"),
            type: "number"
        }, {
            key: "emaPeriod",
            name: this.root.language.translateAny("EMA period"),
            type: "number"
        }, {
            key: "emaColor",
            name: this.root.language.translateAny("EMA period"),
            type: "color"
        });
        const emaSeries = this.panel.series.push(LineSeries.new(this._root, {
            valueXField: "valueX",
            valueYField: "ema",
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            groupDataDisabled: true,
            themeTags: ["indicator", "ema"]
        }));
        this.emaSeries = emaSeries;
    }
    _updateChildren() {
        if (this.isDirty("dPeriod") || this.isDirty("emaPeriod")) {
            this._dataDirty = true;
            this.setCustomData("dPeriod", this.get("dPeriod"));
            this.setCustomData("emaPeriod", this.get("emaPeriod"));
        }
        super._updateChildren();
        if (this.isDirty("emaColor")) {
            this._updateSeriesColor(this.emaSeries, this.get("emaColor"), "emaColor");
        }
    }
    /**
     * @ignore
     * https://www.barchart.com/education/technical-indicators/stochastic_momentum_index
     */
    prepareData() {
        if (this.series) {
            const dataItems = this.get("stockSeries").dataItems;
            let kPeriod = this.get("period", 10);
            let data = [];
            let index = 0;
            $array.each(dataItems, (dataItem) => {
                const valueX = dataItem.get("valueX");
                let lp = Infinity;
                let hp = -lp;
                let hhh;
                let dhl;
                if (index >= kPeriod - 1) {
                    let value = this._getValue(dataItem);
                    if (value != null) {
                        for (let j = index; j > index - kPeriod; j--) {
                            let h = dataItems[j].get("highValueY");
                            let l = dataItems[j].get("lowValueY");
                            if (h != null && l != null) {
                                if (l < lp) {
                                    lp = l;
                                }
                                if (h > hp) {
                                    hp = h;
                                }
                            }
                        }
                        let c = (hp + lp) / 2;
                        hhh = value - c;
                        dhl = hp - lp;
                    }
                }
                if (hhh == null) {
                    data.push({ valueX: valueX });
                }
                else {
                    data.push({ valueX: valueX, hhh: hhh, dhl: dhl });
                }
                index++;
            });
            let dPeriod = this.get("dPeriod", 3);
            this._ema(data, dPeriod, "hhh", "hhh_ema");
            this._ema(data, dPeriod, "hhh_ema", "hhh_ema2");
            this._ema(data, dPeriod, "dhl", "dhl_ema");
            this._ema(data, dPeriod, "dhl_ema", "dhl_ema2");
            $array.each(data, (d) => {
                let hhh = d.hhh_ema2;
                let dhl = d.dhl_ema2;
                if (hhh != null && dhl != null) {
                    d.valueS = d.hhh_ema2 / d.dhl_ema2 * 200;
                }
            });
            let emaPeriod = this.get("emaPeriod", 3);
            this._sma(data, emaPeriod, "valueS", "ema");
            this.series.data.setAll(data);
            this.emaSeries.data.setAll(data);
        }
    }
}
Object.defineProperty(StochasticMomentumIndex, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "StochasticMomentumIndex"
});
Object.defineProperty(StochasticMomentumIndex, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: OverboughtOversold.classNames.concat([StochasticMomentumIndex.className])
});
//# sourceMappingURL=StochasticMomentumIndex.js.map
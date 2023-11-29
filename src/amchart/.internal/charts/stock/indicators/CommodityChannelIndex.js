import { OverboughtOversold } from "./OverboughtOversold";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class CommodityChannelIndex extends OverboughtOversold {
    _afterNew() {
        this._themeTags.push("commoditychannelindex");
        super._afterNew();
        this._editableSettings.unshift({
            key: "period",
            name: this.root.language.translateAny("Period"),
            type: "number"
        }, {
            key: "seriesColor",
            name: this.root.language.translateAny("Period"),
            type: "color"
        });
    }
    /**
     * @ignore
     */
    prepareData() {
        if (this.series) {
            const dataItems = this.get("stockSeries").dataItems;
            let data = this._getTypicalPrice(dataItems);
            let period = this.get("period", 20);
            this._sma(data, period, "value_y", "sma");
            for (let i = 0, len = data.length; i < len; i++) {
                const dataItem = data[i];
                const value = dataItem.value_y;
                let ma = dataItem.sma;
                let meanDeviation = 0;
                if (i >= period - 1) {
                    for (let j = i; j > i - period; j--) {
                        let di = data[j];
                        meanDeviation += Math.abs(di.value_y - ma);
                    }
                    meanDeviation = meanDeviation / period;
                    dataItem.valueS = (value - ma) / (0.015 * meanDeviation);
                }
            }
            this.series.data.setAll(data);
        }
    }
}
Object.defineProperty(CommodityChannelIndex, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "CommodityChannelIndex"
});
Object.defineProperty(CommodityChannelIndex, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: OverboughtOversold.classNames.concat([CommodityChannelIndex.className])
});
//# sourceMappingURL=CommodityChannelIndex.js.map
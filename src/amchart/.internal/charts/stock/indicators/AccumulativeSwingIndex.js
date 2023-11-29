import { ChartIndicator } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
import { Color } from "../../../core/util/Color";
import * as $type from "../../../core/util/Type";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class AccumulativeSwingIndex extends ChartIndicator {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_editableSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [{
                    key: "positiveColor",
                    name: this.root.language.translateAny("Positive color"),
                    type: "color"
                }, {
                    key: "negativeColor",
                    name: this.root.language.translateAny("Negative color"),
                    type: "color"
                }, {
                    key: "limitMoveValue",
                    name: this.root.language.translateAny("Limit move value"),
                    type: "number"
                }]
        });
        Object.defineProperty(this, "_axisRange", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_axisRangeDI", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        this._themeTags.push("accumulativeswingindex");
        super._afterNew();
    }
    _createSeries() {
        const series = this.panel.series.push(LineSeries.new(this._root, {
            themeTags: ["indicator"],
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            valueXField: "valueX",
            valueYField: "asi"
        }));
        const dataItem = this.yAxis.makeDataItem({});
        this._axisRangeDI = dataItem;
        dataItem.set("value", 0);
        dataItem.set("endValue", -100);
        this._axisRange = series.createAxisRange(dataItem);
        this.yAxis.onPrivate("min", (min) => {
            dataItem.set("endValue", min);
        });
        return series;
    }
    _prepareChildren() {
        if (this.isDirty("limitMoveValue")) {
            this.setCustomData("limitMoveValue", this.get("limitMoveValue"));
            this._dataDirty = true;
        }
        const series = this.series;
        if (this.isDirty("positiveColor")) {
            let color = this.get("positiveColor");
            series.setAll({ fill: color, stroke: color });
        }
        if (this.isDirty("negativeColor")) {
            let color = this.get("negativeColor");
            let axisRange = this._axisRange;
            if (axisRange) {
                const fills = axisRange.fills;
                if (fills) {
                    fills.template.set("fill", color);
                }
                const strokes = axisRange.strokes;
                if (strokes) {
                    strokes.template.set("stroke", color);
                }
            }
        }
        super._prepareChildren();
    }
    /**
     * @ignore
     */
    prepareData() {
        if (this.series) {
            const dataItems = this.get("stockSeries").dataItems;
            this.setRaw("field", "close");
            let data = this._getDataArray(dataItems);
            let t = this.get("limitMoveValue", 0.5);
            let asi = 0;
            let negativeColor = this.get("negativeColor", Color.fromHex(0xff0000)).toCSSHex();
            let positiveColor = this.get("positiveColor", Color.fromHex(0x00ff00)).toCSSHex();
            if (dataItems.length > 2) {
                data[0].asi = 0;
                data[0].swingColor = positiveColor;
                for (let i = 1, len = dataItems.length; i < len; i++) {
                    const dataItem = dataItems[i];
                    const yDataItem = dataItems[i - 1];
                    let c = dataItem.get("valueY");
                    if ($type.isNumber(c)) {
                        let cy = yDataItem.get("valueY", c);
                        let h = dataItem.get("highValueY", c);
                        let l = dataItem.get("lowValueY", c);
                        let o = dataItem.get("openValueY", c);
                        let oy = yDataItem.get("openValueY", c);
                        let hl = h - l;
                        let hc = Math.abs(h - cy);
                        let lc = Math.abs(l - cy);
                        let tr = Math.max(hc, lc, hl);
                        let er = 0;
                        if (cy > h) {
                            er = hc;
                        }
                        if (cy < l) {
                            er = lc;
                        }
                        let k = Math.max(hc, lc);
                        let sh = Math.abs(cy - oy);
                        let r = tr - er / 2 + sh / 4;
                        asi += 50 * (c - cy + (c - o) / 2 + (cy - oy) / 4) / r * k / t;
                        let color = positiveColor;
                        if (asi < 0) {
                            color = negativeColor;
                        }
                        data[i].asi = asi;
                        data[i].swingColor = color;
                    }
                }
            }
            this.series.data.setAll(data);
        }
    }
}
Object.defineProperty(AccumulativeSwingIndex, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "AccumulativeSwingIndex"
});
Object.defineProperty(AccumulativeSwingIndex, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ChartIndicator.classNames.concat([AccumulativeSwingIndex.className])
});
//# sourceMappingURL=AccumulativeSwingIndex.js.map
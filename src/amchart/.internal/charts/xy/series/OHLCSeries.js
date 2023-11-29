import { CandlestickSeries } from "./CandlestickSeries";
import { OHLC } from "./OHLC";
import { Template } from "../../../core/util/Template";
import { ListTemplate } from "../../../core/util/List";
import * as $utils from "../../../core/util/Utils";
/**
 * OHLC series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/candlestick-series/} for more info
 * @important
 */
export class OHLCSeries extends CandlestickSeries {
    constructor() {
        super(...arguments);
        /**
         * A list of OHLC bars in the series.
         *
         * `columns.template` can be used to configure OHLC bars.
         *
         * @default new ListTemplate<OHLC>
         */
        Object.defineProperty(this, "columns", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({
                themeTags: ["autocolor"]
            }), () => OHLC._new(this._root, {
                themeTags: $utils.mergeTags(this.columns.template.get("themeTags", []), ["ohlc", "series", "column"])
            }, [this.columns.template]))
        });
    }
    /**
     * @ignore
     */
    makeColumn(dataItem, listTemplate) {
        const column = this.mainContainer.children.push(listTemplate.make());
        column._setDataItem(dataItem);
        listTemplate.push(column);
        return column;
    }
    _processAxisRange(axisRange) {
        super._processAxisRange(axisRange);
        axisRange.columns = new ListTemplate(Template.new({}), () => OHLC._new(this._root, {
            themeTags: $utils.mergeTags(axisRange.columns.template.get("themeTags", []), ["ohlc", "series", "column"]),
        }, [this.columns.template, axisRange.columns.template]));
    }
}
Object.defineProperty(OHLCSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "OHLCSeries"
});
Object.defineProperty(OHLCSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: CandlestickSeries.classNames.concat([OHLCSeries.className])
});
//# sourceMappingURL=OHLCSeries.js.map
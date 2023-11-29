import { ColumnSeries } from "./ColumnSeries";
import { Candlestick } from "./Candlestick";
import { Template } from "../../../core/util/Template";
import { ListTemplate } from "../../../core/util/List";
import * as $utils from "../../../core/util/Utils";
import * as $array from "../../../core/util/Array";
/**
 * Candlestick series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/candlestick-series/} for more info
 * @important
 */
export class CandlestickSeries extends ColumnSeries {
    constructor() {
        super(...arguments);
        /**
         * A list of candles in the series.
         *
         * `columns.template` can be used to configure candles.
         *
         * @default new ListTemplate<Candlestick>
         */
        Object.defineProperty(this, "columns", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({
                themeTags: ["autocolor"]
            }), () => Candlestick._new(this._root, {
                themeTags: $utils.mergeTags(this.columns.template.get("themeTags", []), ["candlestick", "series", "column"])
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
    _updateGraphics(dataItem, previousDataItem) {
        super._updateGraphics(dataItem, previousDataItem);
        const xAxis = this.getRaw("xAxis");
        const yAxis = this.getRaw("yAxis");
        const baseAxis = this.getRaw("baseAxis");
        let vcy = this.get("vcy", 1);
        let vcx = this.get("vcx", 1);
        let lx0;
        let lx1;
        let ly0;
        let ly1;
        let hx0;
        let hx1;
        let hy0;
        let hy1;
        let locationX = this.get("locationX", dataItem.get("locationX", 0.5));
        let locationY = this.get("locationY", dataItem.get("locationY", 0.5));
        let openLocationX = this.get("openLocationX", dataItem.get("openLocationX", locationX));
        let openLocationY = this.get("openLocationY", dataItem.get("openLocationY", locationY));
        let orientation;
        if (yAxis === baseAxis) {
            let open = xAxis.getDataItemPositionX(dataItem, this._xOpenField, 1, vcx);
            let close = xAxis.getDataItemPositionX(dataItem, this._xField, 1, vcx);
            lx1 = xAxis.getDataItemPositionX(dataItem, this._xLowField, 1, vcx);
            hx1 = xAxis.getDataItemPositionX(dataItem, this._xHighField, 1, vcx);
            hx0 = Math.max(open, close);
            lx0 = Math.min(open, close);
            let startLocation = this._aLocationY0 + openLocationY - 0.5;
            let endLocation = this._aLocationY1 + locationY - 0.5;
            ly0 = yAxis.getDataItemPositionY(dataItem, this._yField, startLocation + (endLocation - startLocation) / 2, vcy);
            ly1 = ly0;
            hy0 = ly0;
            hy1 = ly0;
            orientation = "horizontal";
        }
        else {
            let open = yAxis.getDataItemPositionY(dataItem, this._yOpenField, 1, vcy);
            let close = yAxis.getDataItemPositionY(dataItem, this._yField, 1, vcy);
            ly1 = yAxis.getDataItemPositionY(dataItem, this._yLowField, 1, vcy);
            hy1 = yAxis.getDataItemPositionY(dataItem, this._yHighField, 1, vcy);
            hy0 = Math.max(open, close);
            ly0 = Math.min(open, close);
            let startLocation = this._aLocationX0 + openLocationX - 0.5;
            let endLocation = this._aLocationX1 + locationX - 0.5;
            lx0 = xAxis.getDataItemPositionX(dataItem, this._xField, startLocation + (endLocation - startLocation) / 2, vcx);
            lx1 = lx0;
            hx0 = lx0;
            hx1 = lx0;
            orientation = "vertical";
        }
        this._updateCandleGraphics(dataItem, lx0, lx1, ly0, ly1, hx0, hx1, hy0, hy1, orientation);
    }
    _updateCandleGraphics(dataItem, lx0, lx1, ly0, ly1, hx0, hx1, hy0, hy1, orientation) {
        let column = dataItem.get("graphics");
        if (column) {
            let pl0 = this.getPoint(lx0, ly0);
            let pl1 = this.getPoint(lx1, ly1);
            let ph0 = this.getPoint(hx0, hy0);
            let ph1 = this.getPoint(hx1, hy1);
            let x = column.x();
            let y = column.y();
            column.set("lowX0", pl0.x - x);
            column.set("lowY0", pl0.y - y);
            column.set("lowX1", pl1.x - x);
            column.set("lowY1", pl1.y - y);
            column.set("highX0", ph0.x - x);
            column.set("highY0", ph0.y - y);
            column.set("highX1", ph1.x - x);
            column.set("highY1", ph1.y - y);
            column.set("orientation", orientation);
            let rangeGraphics = dataItem.get("rangeGraphics");
            if (rangeGraphics) {
                $array.each(rangeGraphics, (column) => {
                    column.set("lowX0", pl0.x - x);
                    column.set("lowY0", pl0.y - y);
                    column.set("lowX1", pl1.x - x);
                    column.set("lowY1", pl1.y - y);
                    column.set("highX0", ph0.x - x);
                    column.set("highY0", ph0.y - y);
                    column.set("highX1", ph1.x - x);
                    column.set("highY1", ph1.y - y);
                    column.set("orientation", orientation);
                });
            }
        }
    }
    _processAxisRange(axisRange) {
        super._processAxisRange(axisRange);
        axisRange.columns = new ListTemplate(Template.new({}), () => Candlestick._new(this._root, {
            themeTags: $utils.mergeTags(axisRange.columns.template.get("themeTags", []), ["candlestick", "series", "column"]),
        }, [this.columns.template, axisRange.columns.template]));
    }
}
Object.defineProperty(CandlestickSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "CandlestickSeries"
});
Object.defineProperty(CandlestickSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ColumnSeries.classNames.concat([CandlestickSeries.className])
});
//# sourceMappingURL=CandlestickSeries.js.map
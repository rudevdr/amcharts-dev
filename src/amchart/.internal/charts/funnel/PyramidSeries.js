import { FunnelSeries } from "./FunnelSeries";
import { p100 } from "../../core/util/Percent";
import * as $utils from "../../core/util/Utils";
import * as $type from "../../core/util/Type";
/**
 * Creates a pyramid series for use in a [[SlicedChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/pyramid-series/} for more info
 * @important
 */
export class PyramidSeries extends FunnelSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "pyramid"
        });
        Object.defineProperty(this, "_nextSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _prepareChildren() {
        super._prepareChildren();
        this._nextSize = undefined;
    }
    decorateSlice(dataItem) {
        const orientation = this.get("orientation");
        const slicesContainer = this.slicesContainer;
        const slice = dataItem.get("slice");
        const label = dataItem.get("label");
        const link = dataItem.get("link");
        const valueIs = this.get("valueIs", "area");
        const sum = this.getPrivate("valueAbsoluteSum", 0);
        if (sum == 0) {
            return;
        }
        const startLocation = this.get("startLocation", 0);
        const endLocation = this.get("endLocation", 1);
        const tw = this.get("topWidth", 0);
        const bw = this.get("bottomWidth", p100);
        const workingValue = Math.abs(dataItem.get("valueWorking", 0));
        const value = dataItem.get("value", 0);
        let sliceHeight;
        let sliceBottomWidth;
        let pyramidHeight = slicesContainer.innerHeight();
        let pyramidWidth = slicesContainer.innerWidth();
        let linkWidth = link.width();
        let linkHeight = link.height();
        if (orientation == "horizontal") {
            [pyramidWidth, pyramidHeight] = [pyramidHeight, pyramidWidth];
            [linkWidth, linkHeight] = [linkHeight, linkWidth];
        }
        const center = pyramidWidth / 2;
        let d = 1;
        if (value != 0) {
            d = workingValue / Math.abs(value);
        }
        else {
            if (dataItem.isHidden()) {
                d = 0.000001;
            }
        }
        linkHeight *= d;
        pyramidHeight = pyramidHeight * (endLocation - startLocation) - linkHeight * (this._count * this._total - 1);
        let topWidth = $utils.relativeToValue(tw, pyramidWidth);
        if (!$type.isNumber(this._nextSize)) {
            this._nextSize = topWidth;
        }
        let bottomWidth = $utils.relativeToValue(bw, pyramidWidth);
        let sliceTopWidth = this._nextSize;
        let angle = Math.atan2(pyramidHeight, topWidth - bottomWidth);
        let c = Math.tan(Math.PI / 2 - angle);
        if (c == 0) {
            c = 0.00000001;
        }
        if (valueIs == "area") {
            let totalSquare = (topWidth + bottomWidth) / 2 * pyramidHeight;
            let square = totalSquare * workingValue / sum;
            let s = Math.abs(sliceTopWidth * sliceTopWidth - 2 * square * c);
            sliceHeight = (sliceTopWidth - Math.sqrt(s)) / c;
            if (sliceHeight > 0) {
                sliceBottomWidth = (2 * square - sliceHeight * sliceTopWidth) / sliceHeight;
            }
            else {
                sliceBottomWidth = sliceTopWidth;
            }
        }
        else {
            sliceHeight = pyramidHeight * workingValue / sum;
            sliceBottomWidth = sliceTopWidth - sliceHeight * c;
        }
        let labelCoord = this._nextCoord + sliceHeight / 2;
        let sliceX = center;
        let sliceY = this._nextCoord;
        let linkX = center;
        let linkY = sliceY + sliceHeight;
        if (orientation == "vertical") {
            label.set("y", labelCoord);
            if (label.get("opacity") > 0) {
                this._rLabels.push({ label: label, y: labelCoord });
            }
            slice.set("height", sliceHeight);
        }
        else {
            label.set("x", labelCoord);
            if (label.get("opacity") > 0) {
                this._hLabels.push({ label: label, y: labelCoord });
            }
            [sliceX, sliceY] = [sliceY, sliceX];
            [linkX, linkY] = [linkY, linkX];
            slice.set("width", sliceHeight);
        }
        slice.setAll({ orientation, bottomWidth: sliceBottomWidth, topWidth: sliceTopWidth, x: sliceX, y: sliceY });
        link.setAll({ orientation, x: linkX, y: linkY, topWidth: sliceBottomWidth, bottomWidth: sliceBottomWidth });
        this._nextSize = sliceBottomWidth;
        this._nextCoord += sliceHeight + linkHeight;
    }
}
Object.defineProperty(PyramidSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "PyramidSeries"
});
Object.defineProperty(PyramidSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: FunnelSeries.classNames.concat([PyramidSeries.className])
});
//# sourceMappingURL=PyramidSeries.js.map
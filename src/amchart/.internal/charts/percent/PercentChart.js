import { SerialChart } from "../../core/render/SerialChart";
import { PercentDefaultTheme } from "./PercentDefaultTheme";
/**
 * Base class for [[PieChart]].
 *
 * Also used for percent-based series, like [[FunnelSeries]], [[PyramidSeries]], etc.
 *
 * @important
 */
export class PercentChart extends SerialChart {
    _afterNew() {
        this._defaultThemes.push(PercentDefaultTheme.new(this._root));
        super._afterNew();
        this.chartContainer.children.push(this.seriesContainer);
        this.seriesContainer.children.push(this.bulletsContainer);
    }
    _processSeries(series) {
        super._processSeries(series);
        this.seriesContainer.children.moveValue(this.bulletsContainer, this.seriesContainer.children.length - 1);
    }
}
Object.defineProperty(PercentChart, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "PercentChart"
});
Object.defineProperty(PercentChart, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: SerialChart.classNames.concat([PercentChart.className])
});
//# sourceMappingURL=PercentChart.js.map
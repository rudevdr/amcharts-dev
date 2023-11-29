import { PercentChart } from "../percent/PercentChart";
/**
 * Creates a sliced chart for use with [[FunnelSeries]], [[PyramidSeries]], or [[PictorialStackedSeries]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/} for more info
 * @important
 */
export class SlicedChart extends PercentChart {
    _afterNew() {
        super._afterNew();
        this.seriesContainer.setAll({ isMeasured: true, layout: this._root.horizontalLayout });
    }
}
Object.defineProperty(SlicedChart, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "SlicedChart"
});
Object.defineProperty(SlicedChart, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PercentChart.classNames.concat([SlicedChart.className])
});
//# sourceMappingURL=SlicedChart.js.map
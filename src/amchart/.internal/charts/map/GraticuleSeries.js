import { MapLineSeries } from "./MapLineSeries";
import { geoGraticule } from "d3-geo";
/**
 * A [[MapChart]] series to draw a map grid.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/graticule-series/} for more info
 * @important
 */
export class GraticuleSeries extends MapLineSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_dataItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.makeDataItem({})
        });
    }
    _afterNew() {
        super._afterNew();
        this.dataItems.push(this._dataItem);
        this._generate();
    }
    _updateChildren() {
        super._updateChildren();
        if (this.isDirty("step")) {
            this._generate();
        }
        if (this.isDirty("clipExtent")) {
            if (this.get("clipExtent")) {
                const chart = this.chart;
                if (chart) {
                    chart.events.on("geoboundschanged", () => {
                        this._generate();
                    });
                }
                this._generate();
            }
        }
    }
    _generate() {
        let graticule = geoGraticule();
        if (graticule) {
            if (this.get("clipExtent")) {
                const chart = this.chart;
                if (chart) {
                    const geoBounds = chart.geoBounds();
                    if (geoBounds) {
                        graticule.extent([[geoBounds.left, geoBounds.bottom], [geoBounds.right, geoBounds.top]]);
                    }
                }
            }
            const step = this.get("step", 10);
            graticule.stepMinor([360, 360]);
            graticule.stepMajor([step, step]);
            this._dataItem.set("geometry", graticule());
        }
    }
}
Object.defineProperty(GraticuleSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "GraticuleSeries"
});
Object.defineProperty(GraticuleSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: MapLineSeries.classNames.concat([GraticuleSeries.className])
});
//# sourceMappingURL=GraticuleSeries.js.map
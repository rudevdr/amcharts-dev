import { PyramidSeries } from "./PyramidSeries";
import { Graphics } from "../../core/render/Graphics";
import { p100, p50 } from "../../core/util/Percent";
/**
 * Creates a pictorial series for use in a [[SlicedChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/pictorial-stacked-series/} for more info
 * @important
 */
export class PictorialStackedSeries extends PyramidSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "pictorial"
        });
        /**
         * A [[Graphics]] element to used as a mask (shape) for the series.
         *
         * This element is read-only. To modify the mask/shape, use the `svgPath` setting.
         */
        Object.defineProperty(this, "seriesMask", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Graphics.new(this._root, { position: "absolute", x: p50, y: p50, centerX: p50, centerY: p50 })
        });
        Object.defineProperty(this, "seriesGraphics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.slicesContainer.children.push(Graphics.new(this._root, { themeTags: ["pictorial", "background"], position: "absolute", x: p50, y: p50, centerX: p50, centerY: p50 }))
        });
    }
    _afterNew() {
        super._afterNew();
        this.set("topWidth", p100);
        this.set("bottomWidth", p100);
        this.set("valueIs", "height");
        this.slicesContainer.set("mask", this.seriesMask);
    }
    _updateScale() {
        let slicesContainer = this.slicesContainer;
        let w = slicesContainer.innerWidth();
        let h = slicesContainer.innerHeight();
        let seriesMask = this.seriesMask;
        let seriesGraphics = this.seriesGraphics;
        let scale = seriesMask.get("scale", 1);
        const bounds = seriesMask.localBounds();
        let mw = bounds.right - bounds.left;
        let mh = bounds.bottom - bounds.top;
        if (this.get("orientation") == "horizontal") {
            scale = w / mw;
        }
        else {
            scale = h / mh;
        }
        if (scale != Infinity && scale != NaN) {
            seriesMask.set("scale", scale);
            seriesMask.set("x", w / 2);
            seriesMask.set("y", h / 2);
            seriesGraphics.set("scale", scale);
            seriesGraphics.set("x", w / 2);
            seriesGraphics.set("y", h / 2);
        }
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isDirty("svgPath")) {
            const svgPath = this.get("svgPath");
            this.seriesMask.set("svgPath", svgPath);
            this.seriesGraphics.set("svgPath", svgPath);
        }
        this._updateScale();
    }
}
Object.defineProperty(PictorialStackedSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "PictorialStackedSeries"
});
Object.defineProperty(PictorialStackedSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PyramidSeries.classNames.concat([PictorialStackedSeries.className])
});
//# sourceMappingURL=PictorialStackedSeries.js.map
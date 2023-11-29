import { FibonacciSeries } from "./FibonacciSeries";
import { color } from "../../../core/util/Color";
export class FibonacciTimezoneSeries extends FibonacciSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "fibonaccitimezone"
        });
    }
    _updateSegmentReal(index) {
        const dataItems = this._di[index];
        if (dataItems) {
            const diP1 = dataItems["p1"];
            const diP2 = dataItems["p2"];
            if (diP1 && diP2) {
                this._setContext(diP2, "valueY", diP1.get("valueY", 0), true);
                diP1.setRaw("locationX", 0);
                diP2.setRaw("locationX", 0);
            }
        }
    }
    _updateSegment(index) {
        super._updateSegment(index);
        this._updateSegmentReal(index);
    }
    _updateChildrenReal() {
        const chart = this.chart;
        if (chart) {
            for (let i = 0; i < this._lines.length; i++) {
                const line = this._lines[i];
                if (line) {
                    const diP1 = this._di[i]["p1"];
                    const diP2 = this._di[i]["p2"];
                    const di = this._di[i]["e"];
                    const p1 = diP1.get("point");
                    const p2 = diP2.get("point");
                    const open1 = diP1["open"];
                    const open2 = diP2["open"];
                    const xAxis = this.get("xAxis");
                    if (open1 && open2 && di) {
                        const valueX1 = open1["valueX"];
                        const valueX2 = open2["valueX"];
                        const diff = valueX2 - valueX1;
                        if (p1 && p2) {
                            const dataContext = di.dataContext;
                            const sequence = this.get("sequence", []);
                            const labels = this._labels[i];
                            const fills = this._fills[i];
                            const strokes = this._strokes[i];
                            for (let i = 0; i < sequence.length; i++) {
                                const value = sequence[i];
                                const label = labels[i];
                                const fill = fills[i];
                                const stroke = strokes[i];
                                this.mainContainer.children.moveValue(fill, 0);
                                const endValue = valueX1 + diff * value;
                                const x1 = p1.x;
                                const x2 = xAxis.get("renderer").positionToCoordinate(xAxis.valueToPosition(endValue));
                                const y1 = 0;
                                const y2 = chart.plotContainer.height();
                                fill.setPrivate("visible", true);
                                stroke.setPrivate("visible", true);
                                const fillTemplate = dataContext.fill;
                                let fillColor = this.get("colors", [])[i];
                                let strokeColor = fillColor;
                                fill.set("fillOpacity", this.get("fillOpacity", 0) * 0.2);
                                stroke.set("strokeOpacity", this.get("strokeOpacity", 0));
                                if (!fillColor) {
                                    if (fillTemplate) {
                                        fillColor = fillTemplate.get("fill");
                                    }
                                    if (!fillColor) {
                                        fillColor = this.get("fillColor", this.get("fill", color(0x000000)));
                                    }
                                }
                                if (!strokeColor) {
                                    const strokeTemplate = dataContext.stroke;
                                    if (strokeTemplate) {
                                        strokeColor = strokeTemplate.get("stroke");
                                    }
                                    if (!strokeColor) {
                                        strokeColor = this.get("strokeColor", this.get("stroke", color(0x000000)));
                                    }
                                }
                                fill.set("fill", fillColor);
                                stroke.set("stroke", strokeColor);
                                fill.set("draw", (display) => {
                                    display.moveTo(x1, y1);
                                    display.lineTo(x2, y1);
                                    display.lineTo(x2, y2);
                                    display.lineTo(x1, y2);
                                    display.lineTo(x1, y1);
                                });
                                stroke.set("draw", (display) => {
                                    display.moveTo(x2, y1);
                                    display.lineTo(x2, y2);
                                });
                                const dataItem = label.dataItem;
                                if (dataItem) {
                                    dataItem.set("value", value);
                                }
                                label.setAll({ x: x2, y: y2, dy: -20 });
                                label.text.markDirtyText();
                            }
                        }
                    }
                }
            }
        }
    }
}
Object.defineProperty(FibonacciTimezoneSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "FibonacciTimezoneSeries"
});
Object.defineProperty(FibonacciTimezoneSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: FibonacciSeries.classNames.concat([FibonacciTimezoneSeries.className])
});
//# sourceMappingURL=FibonacciTimezoneSeries.js.map
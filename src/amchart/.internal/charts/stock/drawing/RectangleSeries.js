import { SimpleLineSeries } from "./SimpleLineSeries";
export class RectangleSeries extends SimpleLineSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_di", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "rectangle"
        });
    }
    _updateSegment(index) {
        const diP1 = this._di[index]["p1"];
        const diP2 = this._di[index]["p2"];
        const series = this.get("series");
        if (series && diP1 && diP2) {
            let x1 = this._getXValue(diP1.get("valueX"));
            let x2 = this._getXValue(diP2.get("valueX"));
            const field = this.get("field") + "Y";
            let y1 = this._getYValue(diP1.get(field), x1);
            let y2 = this._getYValue(diP2.get(field), x2);
            this._setContext(diP1, "valueY", y1, true);
            this._setContext(diP2, "valueY", y2, true);
            this._positionBullets(diP1);
            this._positionBullets(diP2);
        }
    }
    _setXLocation(dataItem, value) {
        if (!this.get("snapToData")) {
            this._setXLocationReal(dataItem, value);
        }
        else {
            dataItem.set("locationX", 0);
        }
    }
    _updateChildren() {
        super._updateChildren();
        const chart = this.chart;
        this.fills.clear();
        if (chart) {
            for (let i = 0; i < this._lines.length; i++) {
                const line = this._lines[i];
                if (line) {
                    const diP1 = this._di[i]["p1"];
                    const diP2 = this._di[i]["p2"];
                    const di = this._di[i]["e"];
                    const dataContext = di.dataContext;
                    const fillGraphics = this.makeFill(this.fills);
                    const index = this.dataItems.indexOf(diP1);
                    for (let j = index; j >= 0; j--) {
                        const dataContext = this.dataItems[j].dataContext;
                        const template = dataContext.fill;
                        if (template) {
                            fillGraphics.template = template;
                        }
                    }
                    const userData = [this.dataItems.indexOf(diP1), this.dataItems.indexOf(diP2)];
                    let fillColor = this.get("fillColor", this.get("fill"));
                    const fillTemplate = dataContext.fill;
                    if (fillTemplate) {
                        fillColor = fillTemplate.get("fill");
                    }
                    const settings = { userData: userData, fill: fillColor };
                    fillGraphics.setAll(settings);
                    const p1 = diP1.get("point");
                    const p2 = diP2.get("point");
                    if (p1 && p2) {
                        fillGraphics.set("draw", (display) => {
                            display.moveTo(p1.x, p1.y);
                            display.lineTo(p2.x, p1.y);
                            display.lineTo(p2.x, p2.y);
                            display.lineTo(p1.x, p2.y);
                            display.lineTo(p1.x, p1.y);
                        });
                        const strokeGraphics = this.strokes.getIndex(this._getStrokeIndex(i));
                        if (strokeGraphics) {
                            strokeGraphics.set("draw", (display) => {
                                display.moveTo(p1.x, p1.y);
                                display.lineTo(p2.x, p1.y);
                                display.lineTo(p2.x, p2.y);
                                display.lineTo(p1.x, p2.y);
                                display.lineTo(p1.x, p1.y);
                            });
                        }
                        this._updateOthers(i, fillGraphics, p1, p2);
                    }
                }
            }
        }
    }
    _updateOthers(_index, _fillGraphics, _p1, _p2) {
    }
    _drawFill() {
    }
    _updateLine() {
    }
}
Object.defineProperty(RectangleSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "RectangleSeries"
});
Object.defineProperty(RectangleSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: SimpleLineSeries.classNames.concat([RectangleSeries.className])
});
//# sourceMappingURL=RectangleSeries.js.map
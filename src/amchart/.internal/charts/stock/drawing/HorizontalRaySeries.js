import { SimpleLineSeries } from "./SimpleLineSeries";
export class HorizontalRaySeries extends SimpleLineSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "ray"
        });
    }
    _updateSegment(index) {
        if (this._di[index]) {
            const diP1 = this._di[index]["p1"];
            const diP2 = this._di[index]["p2"];
            const series = this.get("series");
            if (series && diP1 && diP2) {
                const valueXns = diP2.get("valueX");
                let valueY = diP2.get("valueY");
                const valueX = this._getXValue(valueXns);
                valueY = this._getYValue(valueY, valueXns);
                this._setContext(diP1, "valueY", valueY, true);
                this._setContext(diP2, "valueY", valueY, true);
                this._setContext(diP2, "valueX", valueX);
                this._setContext(diP1, "valueX", valueX + 1);
                this._setXLocation(diP2, valueX);
                this._setXLocation(diP1, valueX + 1);
                this._positionBullets(diP1);
                this._positionBullets(diP2);
            }
        }
        this._updateElements();
    }
    _updateLine(index, p11, _p22, p1, _p2) {
        const line = this._lines[index];
        const hitLine = this._hitLines[index];
        line.set("points", [p1, p11]);
        hitLine.set("points", [p1, p11]);
    }
    _handlePointerMoveReal() {
    }
    _handlePointerClickReal(event) {
        if (!this._isDragging) {
            this._index++;
            this._addPoints(event, this._index);
            this._isDrawing = false;
        }
    }
    _updateExtensionLine(line, template) {
        line.setAll({
            stroke: template.get("stroke"),
            strokeWidth: template.get("strokeWidth"),
            strokeDasharray: template.get("strokeDasharray"),
            strokeOpacity: template.get("strokeOpacity")
        });
    }
}
Object.defineProperty(HorizontalRaySeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "HorizontalRaySeries"
});
Object.defineProperty(HorizontalRaySeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: SimpleLineSeries.classNames.concat([HorizontalRaySeries.className])
});
//# sourceMappingURL=HorizontalRaySeries.js.map
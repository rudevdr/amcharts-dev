import { SimpleLineSeries } from "./SimpleLineSeries";
export class VerticalLineSeries extends SimpleLineSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "vertical"
        });
    }
    _handleBulletDragged(event) {
        super._handleBulletDragged(event);
        const dataItem = event.target.dataItem;
        const dataContext = dataItem.dataContext;
        if (dataContext) {
            const index = dataContext.index;
            const diP1 = this._di[index]["p1"];
            const diP2 = this._di[index]["p2"];
            const movePoint = this._movePointerPoint;
            if (diP1 && diP2 && movePoint) {
                const yAxis = this.get("yAxis");
                const xAxis = this.get("xAxis");
                const valueX = this._getXValue(xAxis.positionToValue(xAxis.coordinateToPosition(movePoint.x)));
                const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(movePoint.y)), valueX);
                this._setContext(diP1, "valueY", valueY, true);
                this._setContext(diP2, "valueY", valueY + 0.0001, true);
                this._setContext(diP1, "valueX", valueX);
                this._setContext(diP2, "valueX", valueX);
                this._setXLocation(diP1, valueX);
                this._setXLocation(diP2, valueX);
                this._positionBullets(diP1);
                this._positionBullets(diP2);
            }
        }
    }
    _updateSegment(index) {
        if (this._di[index]) {
            const diP1 = this._di[index]["p1"];
            const diP2 = this._di[index]["p2"];
            if (diP1 && diP2) {
                this._setContext(diP2, "valueY", diP1.get("valueY", 0) + 0.0001, true);
            }
        }
    }
    _handlePointerMoveReal() {
    }
    _updateExtensionLine(line, template) {
        line.setAll({
            stroke: template.get("stroke"),
            strokeWidth: template.get("strokeWidth"),
            strokeDasharray: template.get("strokeDasharray"),
            strokeOpacity: template.get("strokeOpacity")
        });
    }
    _handlePointerClickReal(event) {
        if (this._drawingEnabled) {
            if (!this._isDragging) {
                this._index++;
                this._addPoints(event, this._index);
                this._isDrawing = false;
                this._updateSegment(this._index);
            }
        }
    }
}
Object.defineProperty(VerticalLineSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "VerticalLineSeries"
});
Object.defineProperty(VerticalLineSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: SimpleLineSeries.classNames.concat([VerticalLineSeries.className])
});
//# sourceMappingURL=VerticalLineSeries.js.map
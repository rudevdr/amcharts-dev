import { SimpleLineSeries } from "./SimpleLineSeries";
export class HorizontalLineSeries extends SimpleLineSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "horizontal"
        });
        Object.defineProperty(this, "_updateExtension", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
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
            const di = this._di[index]["e"];
            const movePoint = this._movePointerPoint;
            if (diP1 && diP2 && di && movePoint) {
                const yAxis = this.get("yAxis");
                const xAxis = this.get("xAxis");
                const valueX = this._getXValue(xAxis.positionToValue(xAxis.coordinateToPosition(movePoint.x)));
                const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(movePoint.y)), valueX);
                this._setContext(diP1, "valueY", valueY, true);
                this._setContext(diP2, "valueY", valueY, true);
                this._setContext(diP1, "valueX", valueX);
                this._setContext(diP2, "valueX", valueX + 1);
                this._setXLocation(diP1, valueX);
                this._setXLocation(diP2, valueX + 1);
                this._positionBullets(diP1);
                this._positionBullets(diP2);
            }
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
    _handlePointerMoveReal() {
    }
    _handlePointerClickReal(event) {
        if (this._drawingEnabled) {
            if (!this._isDragging) {
                this._index++;
                this._addPoints(event, this._index);
                this._isDrawing = false;
            }
        }
    }
}
Object.defineProperty(HorizontalLineSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "HorizontalLineSeries"
});
Object.defineProperty(HorizontalLineSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: SimpleLineSeries.classNames.concat([HorizontalLineSeries.className])
});
//# sourceMappingURL=HorizontalLineSeries.js.map
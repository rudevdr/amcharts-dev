import { Line } from "../../../core/render/Line";
import { DrawingSeries } from "./DrawingSeries";
import * as $array from "../../../core/util/Array";
export class PolylineSeries extends DrawingSeries {
    constructor() {
        super(...arguments);
        // point index in segment
        Object.defineProperty(this, "_pIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "polyline"
        });
        Object.defineProperty(this, "_drawingLine", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.mainContainer.children.push(Line.new(this._root, { forceInactive: true }))
        });
    }
    _handlePointerClick(event) {
        if (this._drawingEnabled) {
            super._handlePointerClick(event);
            if (!this._isDragging) {
                this._isDrawing = true;
                // for consistency with other series
                if (this._index == 0) {
                    this._index = 1;
                }
                if (this._pIndex == 0) {
                    this.data.push({ stroke: this._getStrokeTemplate(), index: this._index, corner: "e" });
                }
                this._drawingLine.show();
                this._addPoint(event);
            }
            this._drawingLine.set("stroke", this.get("strokeColor"));
        }
    }
    _handleBulletDragStop(event) {
        super._handleBulletDragStop(event);
        this._checkClosing(event);
    }
    disableDrawing() {
        super.disableDrawing();
        this._drawingLine.hide();
    }
    _afterDataChange() {
        super._afterDataChange();
        const dataItems = this.dataItems;
        if (dataItems.length > 0) {
            const lastDataItem = dataItems[dataItems.length - 1];
            const dataContext = lastDataItem.dataContext;
            if (dataContext.closing) {
                this._pIndex = 0;
            }
        }
    }
    clearDrawings() {
        super.clearDrawings();
        this._drawingLine.hide();
    }
    _addPoint(event) {
        const chart = this.chart;
        if (chart) {
            const xAxis = this.get("xAxis");
            const yAxis = this.get("yAxis");
            const point = chart.plotContainer.toLocal(event.point);
            const valueX = this._getXValue(xAxis.positionToValue(xAxis.coordinateToPosition(point.x)));
            const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(point.y)), valueX);
            const dataItems = this.dataItems;
            const len = dataItems.length;
            this.data.push({ valueY: valueY, valueX: valueX, index: this._index, corner: this._pIndex });
            this.setPrivate("startIndex", 0);
            this.setPrivate("endIndex", len);
            const dataItem = dataItems[len];
            this._positionBullets(dataItem);
            this._setXLocation(dataItem, valueX);
            this._pIndex++;
            this._handleClosing(dataItem, point);
        }
    }
    _checkClosing(event) {
        const dataItem = event.target.dataItem;
        if (dataItem) {
            const sprite = event.target;
            const point = { x: sprite.x(), y: sprite.y() };
            this._handleClosing(dataItem, point);
        }
    }
    _handleClosing(dataItem, point) {
        const dataContext = dataItem.dataContext;
        if (!dataContext.closing) {
            const index = dataContext.index;
            if (this._di[index]) {
                const firstDataItem = this._di[index][0];
                if (firstDataItem && firstDataItem != dataItem) {
                    const dPoint = firstDataItem.get("point");
                    if (dPoint) {
                        if (Math.hypot(point.x - dPoint.x, point.y - dPoint.y) < 5) {
                            dataContext.closing = true;
                            this._pIndex = 0;
                            this.data.push({ stroke: this._getStrokeTemplate(), index: index + 1, corner: "e" });
                            this._drawingLine.hide();
                        }
                    }
                }
            }
        }
    }
    _handlePointerMove(event) {
        super._handlePointerMove(event);
        if (this._isDrawing) {
            const movePoint = this._movePointerPoint;
            if (movePoint) {
                const dataItems = this.dataItems;
                const len = dataItems.length;
                if (len > 0) {
                    const lastItem = dataItems[len - 1];
                    const point = lastItem.get("point");
                    if (point) {
                        this._drawingLine.set("points", [point, movePoint]);
                    }
                }
            }
        }
    }
    _updateElements() {
        $array.each(this.dataItems, (dataItem) => {
            const dataContext = dataItem.dataContext;
            if (dataContext) {
                const closing = dataContext.closing;
                if (closing) {
                    if (this._di[dataContext.index]) {
                        const closingDataItem = this._di[dataContext.index][0];
                        const valueX = closingDataItem.get("valueX", 0);
                        const valueY = closingDataItem.get("valueY");
                        this._setContext(dataItem, "valueX", valueX);
                        this._setContext(dataItem, "valueY", valueY, true);
                        this._setXLocation(dataItem, valueX);
                        this._positionBullets(dataItem);
                        const bullets = dataItem.bullets;
                        if (bullets) {
                            $array.each(bullets, (bullet) => {
                                const sprite = bullet.get("sprite");
                                if (sprite) {
                                    sprite.set("forceHidden", true);
                                }
                            });
                        }
                    }
                }
            }
        });
    }
}
Object.defineProperty(PolylineSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "PolylineSeries"
});
Object.defineProperty(PolylineSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: DrawingSeries.classNames.concat([PolylineSeries.className])
});
//# sourceMappingURL=PolylineSeries.js.map
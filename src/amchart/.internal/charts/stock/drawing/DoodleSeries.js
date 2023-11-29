import { DrawingSeries } from "./DrawingSeries";
export class DoodleSeries extends DrawingSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_panX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_panY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
            value: "doodle"
        });
    }
    _afterNew() {
        super._afterNew();
        this.setPrivate("allowChangeSnap", false);
        this.bullets.clear();
    }
    _handlePointerMove(event) {
        super._handlePointerMove(event);
        if (this._drawingEnabled && this._isPointerDown) {
            this._handleBulletPosition(event);
        }
    }
    _handleBulletPosition(event) {
        const chart = this.chart;
        if (chart) {
            const xAxis = this.get("xAxis");
            const yAxis = this.get("yAxis");
            const point = chart.plotContainer.toLocal(event.point);
            const valueX = this._getXValue(xAxis.positionToValue(xAxis.coordinateToPosition(point.x)));
            const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(point.y)), valueX);
            const index = this._index;
            this.data.push({ valueY: valueY, valueX: valueX, index: index, corner: this._pIndex });
            const len = this.dataItems.length;
            const dataItem = this.dataItems[len - 1];
            this._setXLocation(dataItem, valueX);
            let segmentItems = this._di[index];
            if (!segmentItems) {
                segmentItems = {};
            }
            segmentItems[this._pIndex] = dataItem;
            this._di[index] = segmentItems;
            this._pIndex++;
            this.setPrivate("startIndex", 0);
            this.setPrivate("endIndex", len);
        }
    }
    _handleFillDragStart(e, index) {
        if (!this._drawingEnabled) {
            super._handleFillDragStart(e, index);
        }
    }
    _handlePointerDown(event) {
        super._handlePointerDown(event);
        const chart = this.chart;
        if (chart) {
            this._index++;
            this._pIndex = 0;
            this._panX = chart.get("panX");
            this._panY = chart.get("panY");
            chart.set("panX", false);
            chart.set("panY", false);
            const cursor = chart.get("cursor");
            if (cursor) {
                cursor.setPrivate("visible", false);
            }
            this.data.push({ stroke: this._getStrokeTemplate(), index: this._index, corner: this._pIndex });
        }
    }
    _handlePointerUp(event) {
        super._handlePointerUp(event);
        const chart = this.chart;
        if (chart) {
            this.setTimeout(() => {
                chart.set("panX", this._panX);
                chart.set("panY", this._panY);
                const cursor = chart.get("cursor");
                if (cursor) {
                    cursor.setPrivate("visible", true);
                }
            }, 100);
        }
    }
}
Object.defineProperty(DoodleSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "DoodleSeries"
});
Object.defineProperty(DoodleSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: DrawingSeries.classNames.concat([DoodleSeries.className])
});
//# sourceMappingURL=DoodleSeries.js.map
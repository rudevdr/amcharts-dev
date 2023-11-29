import { DrawingSeries } from "./DrawingSeries";
import { Ellipse } from "../../../core/render/Ellipse";
import { ListTemplate } from "../../../core/util/List";
import { Template } from "../../../core/util/Template";
import * as $array from "../../../core/util/Array";
export class EllipseSeries extends DrawingSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_ellipses", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "ellipse"
        });
        Object.defineProperty(this, "_clickPX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_clickVY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "ellipses", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({ radiusX: 0, radiusY: 0 }), () => Ellipse._new(this._root, { radiusX: 0, radiusY: 0, templateField: "settings" }, [this.ellipses.template]))
        });
    }
    /**
     * @ignore
     */
    makeEllipse() {
        const ellipse = this.ellipses.make();
        this.mainContainer.children.push(ellipse);
        this.ellipses.push(ellipse);
        return ellipse;
    }
    _afterNew() {
        super._afterNew();
        this.setPrivate("allowChangeSnap", false);
        this.strokes.template.set("visible", false);
        this.fills.template.set("visible", false);
        const ellipseTemplate = this.ellipses.template;
        ellipseTemplate.events.on("pointerover", (e) => {
            this._showSegmentBullets(e.target.get("userData"));
        });
        ellipseTemplate.events.on("pointerout", () => {
            this._hideAllBullets();
        });
        ellipseTemplate.events.on("dragstart", (e) => {
            this._handleFillDragStart(e, e.target.get("userData"));
        });
        ellipseTemplate.events.on("dragstop", (e) => {
            this._handleFillDragStop(e, e.target.get("userData"));
        });
        ellipseTemplate.events.on("click", (e) => {
            if (this._erasingEnabled) {
                this._disposeIndex(e.target.get("userData"));
            }
        });
    }
    _handleFillDragStop(event, index) {
        super._handleFillDragStop(event, index);
        const items = this._di[index];
        const bDI = items["b"];
        const tDI = items["t"];
        const rDI = items["r"];
        const lDI = items["l"];
        const xAxis = this.get("xAxis");
        if (bDI && tDI && rDI && lDI) {
            const positionL = xAxis.valueToPosition(lDI.get("valueX", 0));
            const positionR = xAxis.valueToPosition(rDI.get("valueX", 0));
            let mx = this._getXValue(xAxis.positionToValue(positionL + (positionR - positionL) / 2));
            this._setContext(tDI, "valueX", mx);
            this._setContext(bDI, "valueX", mx);
            this._setXLocation(tDI, mx);
            this._setXLocation(bDI, mx);
        }
    }
    _handleBulletDragged(event) {
        const dataItem = event.target.dataItem;
        const valueXReal = dataItem.get("valueX");
        const locationXReal = dataItem.get("locationX");
        const valueYReal = dataItem.get("valueY");
        super._handleBulletDragged(event);
        const movePoint = this._movePointerPoint;
        if (dataItem && movePoint) {
            const dataContext = dataItem.dataContext;
            const index = dataContext.index;
            const corner = dataContext.corner;
            const xAxis = this.get("xAxis");
            const yAxis = this.get("yAxis");
            const valueX = this._getXValue(xAxis.positionToValue(xAxis.coordinateToPosition(movePoint.x)));
            const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(movePoint.y)), valueX);
            const vx = "valueX";
            const vy = "valueY";
            const vwy = "valueYWorking";
            const items = this._di[index];
            const bDI = items["b"];
            const tDI = items["t"];
            const rDI = items["r"];
            const lDI = items["l"];
            if (bDI && tDI && rDI && lDI) {
                if (corner == "b") {
                    const valueY0 = tDI.get(vwy, 0);
                    this._setContext(bDI, vy, valueY, true);
                    let my = valueY0 + (valueY - valueY0) / 2;
                    this._setContext(rDI, vy, my, true);
                    this._setContext(lDI, vy, my, true);
                    this._setContext(bDI, vx, valueXReal);
                    bDI.set("locationX", locationXReal);
                }
                if (corner == "t") {
                    const valueY0 = bDI.get(vwy, 0);
                    this._setContext(tDI, vy, valueY, true);
                    let my = valueY0 + (valueY - valueY0) / 2;
                    this._setContext(rDI, vy, my, true);
                    this._setContext(lDI, vy, my, true);
                    this._setContext(tDI, vx, valueXReal);
                    tDI.set("locationX", locationXReal);
                }
                if (corner == "l") {
                    const valueX0 = rDI.get(vx, 0);
                    const positionX0 = xAxis.valueToPosition(valueX0);
                    const positionX = xAxis.valueToPosition(valueX);
                    this._setContext(lDI, vx, valueX);
                    this._setXLocation(lDI, valueX);
                    let mpos = positionX0 + (positionX - positionX0) / 2;
                    let mx = this._getXValue(xAxis.positionToValue(mpos));
                    this._setContext(tDI, vx, mx);
                    this._setContext(bDI, vx, mx);
                    this._setXLocation(tDI, mx);
                    this._setXLocation(bDI, mx);
                    this._setContext(lDI, vy, valueYReal, true);
                }
                if (corner == "r") {
                    const valueX0 = lDI.get(vx, 0);
                    const positionX0 = xAxis.valueToPosition(valueX0);
                    const positionX = xAxis.valueToPosition(valueX);
                    this._setContext(rDI, vx, valueX);
                    this._setXLocation(rDI, valueX);
                    let mpos = positionX0 + (positionX - positionX0) / 2;
                    let mx = this._getXValue(xAxis.positionToValue(mpos));
                    this._setContext(tDI, vx, mx);
                    this._setContext(bDI, vx, mx);
                    this._setXLocation(tDI, mx);
                    this._setXLocation(bDI, mx);
                    this._setContext(rDI, vy, valueYReal, true);
                }
            }
            this._positionBullets(dataItem);
        }
    }
    _handlePointerClick(event) {
        if (this._drawingEnabled) {
            super._handlePointerClick(event);
            if (!this._isDragging) {
                if (!this._isDrawing) {
                    this._index++;
                    this._isDrawing = true;
                    this.bulletsContainer.show();
                    this._addPoints(event, this._index);
                }
                else {
                    this._isDrawing = false;
                }
            }
        }
    }
    _createElements(index, dataItem) {
        if (!this._ellipses[index]) {
            const ellipse = this.makeEllipse();
            ellipse._setDataItem(dataItem);
            this._ellipses[index] = ellipse;
            ellipse.setAll({ userData: index });
        }
    }
    _handlePointerMove(event) {
        super._handlePointerMove(event);
        if (this._isDrawing) {
            const movePoint = this._movePointerPoint;
            if (movePoint) {
                const xAxis = this.get("xAxis");
                const yAxis = this.get("yAxis");
                const index = this._index;
                const dataItems = this._di[index];
                if (dataItems) {
                    const diT = this._di[index]["t"];
                    const diB = this._di[index]["b"];
                    const diL = this._di[index]["l"];
                    const diR = this._di[index]["r"];
                    const valueY0 = this._clickVY;
                    const positionX = xAxis.coordinateToPosition(movePoint.x);
                    const positionX0 = this._clickPX;
                    const valueX = this._getXValue(xAxis.positionToValue(xAxis.coordinateToPosition(movePoint.x)));
                    const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(movePoint.y)), valueX);
                    if (diB && diL && diR && diT) {
                        this._setContext(diB, "valueY", valueY, true);
                        const my = valueY0 + (valueY - valueY0) / 2;
                        const mx = this._getXValue(xAxis.positionToValue(positionX0 + (positionX - positionX0) / 2));
                        this._setContext(diR, "valueY", my, true);
                        this._setContext(diL, "valueY", my, true);
                        this._setContext(diB, "valueX", mx);
                        this._setContext(diT, "valueX", mx);
                        this._setXLocation(diB, mx);
                        this._setXLocation(diT, mx);
                        this._setContext(diR, "valueX", valueX);
                        this._setXLocation(diR, valueX);
                    }
                }
            }
        }
    }
    _addPoints(event, index) {
        const chart = this.chart;
        if (chart) {
            this.data.push({ settings: this._getEllipseTemplate(), stroke: this._getStrokeTemplate(), index: index, corner: "e" });
            const xAxis = this.get("xAxis");
            const yAxis = this.get("yAxis");
            const point = chart.plotContainer.toLocal(event.point);
            this._clickPX = xAxis.coordinateToPosition(point.x);
            const valueX = this._getXValue(xAxis.positionToValue(this._clickPX));
            const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(point.y)), valueX);
            this._clickVY = valueY;
            this._di[index] = {};
            this._addPoint(valueX, valueY, "l", index);
            this._addPoint(valueX, valueY, "t", index);
            this._addPoint(valueX, valueY, "b", index);
            this._addPoint(valueX, valueY, "r", index);
        }
    }
    _addPoint(valueX, valueY, corner, index) {
        this.data.push({ valueY: valueY, valueX: valueX, index: index, corner: corner });
        const len = this.dataItems.length;
        const dataItem = this.dataItems[len - 1];
        if (dataItem) {
            this._setXLocation(dataItem, valueX);
            this.setPrivate("startIndex", 0);
            this.setPrivate("endIndex", len);
        }
    }
    _updateChildren() {
        super._updateChildren();
        let index = 0;
        $array.each(this._di, (dataItems) => {
            if (dataItems) {
                const diT = dataItems["t"];
                const diB = dataItems["b"];
                const diL = dataItems["l"];
                const diR = dataItems["r"];
                if (diT && diB && diL && diR) {
                    const pt = diT.get("point");
                    const pb = diB.get("point");
                    const pr = diR.get("point");
                    const pl = diL.get("point");
                    if (pt && pb && pr && pl) {
                        const rx = (pr.x - pl.x) / 2;
                        const ry = (pb.y - pt.y) / 2;
                        const x = pl.x + rx;
                        const y = pt.y + ry;
                        const ellipse = this._ellipses[index];
                        if (ellipse) {
                            ellipse.setAll({ x: x, y: y, radiusX: rx, radiusY: ry });
                        }
                    }
                }
            }
            index++;
        });
    }
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        const dataContext = dataItem.dataContext;
        if (dataContext) {
            const index = dataContext.index;
            const ellipse = this._ellipses[index];
            if (ellipse) {
                delete (this._ellipses[index]);
                this.ellipses.removeValue(ellipse);
                ellipse.dispose();
            }
        }
    }
    _getEllipseTemplate() {
        const template = this._getStrokeTemplate();
        const fillColor = this.get("fillColor");
        if (fillColor != null) {
            template.set("fill", fillColor);
        }
        const fillOpacity = this.get("fillOpacity");
        if (fillOpacity != null) {
            template.set("fillOpacity", fillOpacity);
        }
        return template;
    }
    setInteractive(value) {
        super.setInteractive(value);
        this.ellipses.template.set("forceInactive", !value);
    }
}
Object.defineProperty(EllipseSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "EllipseSeries"
});
Object.defineProperty(EllipseSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: DrawingSeries.classNames.concat([EllipseSeries.className])
});
//# sourceMappingURL=EllipseSeries.js.map
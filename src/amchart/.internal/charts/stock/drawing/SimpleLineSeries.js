import { DrawingSeries } from "./DrawingSeries";
import { Line } from "../../../core/render/Line";
import { ListTemplate } from "../../../core/util/List";
import { Template } from "../../../core/util/Template";
import * as $math from "../../../core/util/Math";
export class SimpleLineSeries extends DrawingSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "line"
        });
        Object.defineProperty(this, "_updateExtension", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "lines", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Line._new(this._root, {}, [this.lines.template]))
        });
        Object.defineProperty(this, "hitLines", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Line._new(this._root, {}, [this.hitLines.template]))
        });
        Object.defineProperty(this, "_di", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_lines", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_hitLines", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    /**
     * @ignore
     */
    makeLine() {
        const line = this.lines.make();
        this.mainContainer.children.push(line);
        this.lines.push(line);
        return line;
    }
    /**
     * @ignore
     */
    makeHitLine() {
        const line = this.hitLines.make();
        line.addTag("hit");
        this.mainContainer.children.push(line);
        this.hitLines.push(line);
        return line;
    }
    _afterNew() {
        super._afterNew();
        const lineTemplate = this.lines.template;
        lineTemplate.events.on("pointerover", (e) => {
            this._showSegmentBullets(e.target.get("userData"));
        });
        lineTemplate.events.on("pointerout", (e) => {
            this._hideAllBullets();
            const index = e.target.get("userData");
            const line = this._lines[index];
            if (line) {
                line.unhover();
            }
            const strokeIndex = this._getStrokeIndex(index);
            const stroke = this.strokes.getIndex(strokeIndex);
            if (stroke) {
                stroke.unhover();
            }
        });
        const hitTemplate = this.hitLines.template;
        hitTemplate.events.on("pointerover", (e) => {
            const index = e.target.get("userData");
            this._showSegmentBullets(index);
            const line = this._lines[index];
            if (line) {
                line.hover();
            }
            const strokeIndex = this._getStrokeIndex(index);
            const stroke = this.strokes.getIndex(strokeIndex);
            if (stroke) {
                stroke.hover();
            }
        });
        hitTemplate.events.on("click", (e) => {
            if (this._erasingEnabled) {
                this._disposeIndex(e.target.get("userData"));
            }
        });
        hitTemplate.events.on("dragstart", (e) => {
            const index = e.target.get("userData");
            const line = this._lines[index];
            if (line) {
                line.dragStart(e);
            }
            const strokeIndex = this._getStrokeIndex(index);
            const stroke = this.strokes.getIndex(strokeIndex);
            if (stroke) {
                stroke.dragStart(e);
            }
        });
        hitTemplate.events.on("dragstop", (e) => {
            const index = e.target.get("userData");
            this.markDirtyValues();
            e.target.setAll({ x: 0, y: 0 });
            const line = this._lines[index];
            if (line) {
                line.dragStop(e);
                line.setAll({ x: 0, y: 0 });
            }
            const strokeIndex = this._getStrokeIndex(index);
            const stroke = this.strokes.getIndex(strokeIndex);
            if (stroke) {
                stroke.dragStop(e);
                stroke.setAll({ x: 0, y: 0 });
            }
        });
        hitTemplate.events.on("pointerout", (e) => {
            const index = e.target.get("userData");
            this._hideAllBullets();
            const line = this._lines[index];
            if (line) {
                line.unhover();
            }
            const strokeIndex = this._getStrokeIndex(index);
            const stroke = this.strokes.getIndex(strokeIndex);
            if (stroke) {
                stroke.unhover();
            }
        });
    }
    _updateElements() {
        const chart = this.chart;
        if (chart) {
            const s = Math.max(chart.plotContainer.width(), chart.plotContainer.height()) * 2;
            for (let i = 0; i < this._lines.length; i++) {
                const line = this._lines[i];
                if (line) {
                    const diP1 = this._di[i]["p1"];
                    const diP2 = this._di[i]["p2"];
                    if (diP1 && diP2) {
                        const p1 = diP1.get("point");
                        const p2 = diP2.get("point");
                        if (p1 && p2) {
                            const len = Math.max(Math.abs(s - p1.x), Math.abs(s - p2.x), Math.abs(s - p1.y), Math.abs(s - p2.y), Math.abs(p1.x), Math.abs(p2.x), Math.abs(p1.y), Math.abs(p2.y));
                            let angle = $math.getAngle(p2, p1);
                            const p11 = { x: p1.x + len * $math.cos(angle), y: p1.y + len * $math.sin(angle) };
                            const p22 = { x: p2.x - len * $math.cos(angle), y: p2.y - len * $math.sin(angle) };
                            this._updateLine(i, p11, p22, p1, p2);
                        }
                    }
                }
            }
        }
    }
    _updateLine(index, p11, p22, p1, p2) {
        const line = this._lines[index];
        const hitLine = this._hitLines[index];
        let segments = [[[p11, p1]], [[p2, p22]]];
        let hitSegments = [[[p11, p22]]];
        line.set("segments", segments);
        hitLine.set("segments", hitSegments);
    }
    _handlePointerClickReal(event) {
        if (!this._isDragging) {
            if (!this._isDrawing) {
                this._isDrawing = true;
                this._index++;
                this._addPoints(event, this._index);
            }
            else {
                this._isDrawing = false;
            }
        }
    }
    _handlePointerClick(event) {
        if (this._drawingEnabled) {
            super._handlePointerClick(event);
            this._handlePointerClickReal(event);
        }
    }
    _handlePointerMove(event) {
        super._handlePointerMove(event);
        this._handlePointerMoveReal(event);
    }
    _handlePointerMoveReal(_event) {
        if (this._isDrawing) {
            const movePoint = this._movePointerPoint;
            const index = this._index;
            const dataItems = this._di[index];
            if (movePoint && dataItems) {
                const xAxis = this.get("xAxis");
                const yAxis = this.get("yAxis");
                const valueXns = xAxis.positionToValue(xAxis.coordinateToPosition(movePoint.x)); // not snapped
                const valueX = this._getXValue(valueXns);
                const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(movePoint.y)), valueXns);
                const diP1 = dataItems["p1"];
                const diP2 = dataItems["p2"];
                if (diP1 && diP2) {
                    this._setContext(diP2, "valueX", valueX, true);
                    this._setContext(diP2, "valueY", valueY, true);
                    this._setXLocation(diP1, diP1.get("valueX", 0));
                    this._setXLocation(diP2, valueX);
                    this._updateSegment(index);
                }
            }
        }
    }
    _createElements(index) {
        if (!this._lines[index]) {
            const line = this.makeLine();
            this._lines[index] = line;
            const hitLine = this.makeHitLine();
            this._hitLines[index] = hitLine;
            const dataContext = this.dataItems[this.dataItems.length - 1].dataContext;
            let showExtension = this.get("showExtension", true);
            let color = this.get("strokeColor", this.get("stroke"));
            const strokeTemplate = dataContext.stroke;
            if (strokeTemplate) {
                color = strokeTemplate.get("stroke");
                this._updateExtensionLine(line, strokeTemplate);
            }
            if (dataContext) {
                showExtension = dataContext.showExtension;
            }
            line.setPrivate("visible", showExtension);
            const settings = { stroke: color, userData: index };
            line.setAll(settings);
            hitLine.setAll(settings);
            this._updateSegment(index);
        }
    }
    _updateExtensionLine(_line, _template) {
    }
    _addTemplates(index) {
        this.data.push({ stroke: this._getStrokeTemplate(), fill: this._getFillTemplate(), index: index, showExtension: this.get("showExtension", true), corner: "e" });
    }
    _addPoints(event, index) {
        const chart = this.chart;
        this._addTemplates(index);
        const xAxis = this.get("xAxis");
        const yAxis = this.get("yAxis");
        const point = chart.plotContainer.toLocal(event.point);
        const valueYns = xAxis.positionToValue(xAxis.coordinateToPosition(point.x));
        const valueX = this._getXValue(valueYns);
        const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(point.y)), valueYns);
        this._addPointsReal(valueX, valueY, index);
    }
    _addPointsReal(valueX, valueY, index) {
        this._addPoint(valueX, valueY, "p1", index);
        this._addPoint(valueX, valueY, "p2", index);
    }
    _addPoint(valueX, valueY, corner, index) {
        this.data.push({ valueY: valueY, valueX: valueX, corner: corner, index: index });
    }
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        const dataContext = dataItem.dataContext;
        if (dataContext) {
            const index = dataContext.index;
            const line = this._lines[index];
            if (line) {
                this.lines.removeValue(line);
                delete (this._lines[index]);
                line.dispose();
            }
            const hitLine = this._hitLines[index];
            if (hitLine) {
                this.hitLines.removeValue(hitLine);
                delete (this._hitLines[index]);
                hitLine.dispose();
            }
        }
    }
    setInteractive(value) {
        super.setInteractive(value);
        this.hitLines.template.set("forceInactive", !value);
        this.lines.template.set("forceInactive", !value);
    }
}
Object.defineProperty(SimpleLineSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "SimpleLineSeries"
});
Object.defineProperty(SimpleLineSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: DrawingSeries.classNames.concat([SimpleLineSeries.className])
});
//# sourceMappingURL=SimpleLineSeries.js.map
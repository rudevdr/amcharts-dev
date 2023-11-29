import { SimpleLineSeries } from "./SimpleLineSeries";
import { Label } from "../../../core/render/Label";
import { ListTemplate } from "../../../core/util/List";
import { Template } from "../../../core/util/Template";
import * as $array from "../../../core/util/Array";
export class FibonacciSeries extends SimpleLineSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "fibonacci"
        });
        Object.defineProperty(this, "_labels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_fills", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_strokes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        /**
         * A list of labels.
         *
         * `labels.template` can be used to configure axis labels.
         *
         * @default new ListTemplate<Label>
         */
        Object.defineProperty(this, "labels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Label._new(this._root, {}, [this.labels.template]))
        });
    }
    /**
     * @ignore
     */
    makeLabel() {
        const label = this.labels.make();
        this.bulletsContainer.children.push(label);
        this.labels.push(label);
        return label;
    }
    _updateChildren() {
        super._updateChildren();
        this._updateChildrenReal();
    }
    _updateChildrenReal() {
        const chart = this.chart;
        if (chart) {
            const yAxis = this.get("yAxis");
            for (let i = 0; i < this._lines.length; i++) {
                const line = this._lines[i];
                if (line) {
                    const diP1 = this._di[i]["p1"];
                    const diP2 = this._di[i]["p2"];
                    const p1 = diP1.get("point");
                    const p2 = diP2.get("point");
                    if (p1 && p2) {
                        const sequence = this.get("sequence", []);
                        let prevValue = 0;
                        const labels = this._labels[i];
                        const strokes = this._strokes[i];
                        const fills = this._fills[i];
                        for (let i = 0; i < sequence.length; i++) {
                            const value = sequence[i] - 1;
                            const label = labels[i];
                            const fill = fills[i];
                            const stroke = strokes[i];
                            let fillColor = this.get("colors", [])[i];
                            let strokeColor = fillColor;
                            fill.set("fill", fillColor);
                            fill.set("fillOpacity", this.get("fillOpacity", 0));
                            stroke.set("stroke", strokeColor);
                            stroke.set("strokeOpacity", this.get("strokeOpacity", 0));
                            const y1 = p1.y + (p2.y - p1.y) * prevValue;
                            const y2 = p1.y + (p2.y - p1.y) * -value;
                            const realValue = yAxis.positionToValue(yAxis.coordinateToPosition(y2));
                            fill.setPrivate("visible", true);
                            stroke.setPrivate("visible", true);
                            fill.set("draw", (display) => {
                                display.moveTo(p1.x, y1);
                                display.lineTo(p2.x, y1);
                                display.lineTo(p2.x, y2);
                                display.lineTo(p1.x, y2);
                                display.lineTo(p1.x, y1);
                            });
                            stroke.set("draw", (display) => {
                                display.moveTo(p1.x, y2);
                                display.lineTo(p2.x, y2);
                            });
                            const dataItem = label.dataItem;
                            if (dataItem) {
                                dataItem.set("value", realValue);
                            }
                            label.setAll({ x: p2.x, y: y2, fill: fillColor });
                            label.text.markDirtyText();
                            prevValue = -value;
                        }
                    }
                }
            }
        }
    }
    _createElements(index) {
        super._createElements(index);
        if (!this._fills[index]) {
            const labelArr = [];
            const fillsArr = [];
            const strokesArr = [];
            const sequence = this.get("sequence", []);
            for (let i = 0; i < sequence.length; i++) {
                const label = this.makeLabel();
                const dataItem = this.makeDataItem({});
                dataItem.set("sequence", sequence[i]);
                label._setDataItem(dataItem);
                labelArr.push(label);
                const fill = this.makeFill(this.fills);
                fillsArr.push(fill);
                const stroke = this.makeStroke(this.strokes);
                strokesArr.push(stroke);
            }
            this._labels[index] = labelArr;
            this._fills[index] = fillsArr;
            this._strokes[index] = strokesArr;
        }
    }
    _drawFill() {
    }
    _drawStroke() {
    }
    _updateLine() {
    }
    _clearGraphics() {
    }
    enableDrawing() {
        super.enableDrawing();
        this.showAllBullets();
    }
    enableErasing() {
        super.enableErasing();
        this.showAllBullets();
    }
    _hideAllBullets() {
        if (this._drawingEnabled || this._erasingEnabled) {
        }
        else {
            super._hideAllBullets();
        }
    }
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        const dataContext = dataItem.dataContext;
        if (dataContext) {
            const index = dataContext.index;
            const labels = this._labels[index];
            const fills = this._fills[index];
            const strokes = this._strokes[index];
            if (labels) {
                $array.each(labels, (item) => {
                    item.dispose();
                    this.labels.removeValue(item);
                });
                delete (this._labels[index]);
            }
            if (fills) {
                $array.each(fills, (item) => {
                    this.fills.removeValue(item);
                    item.dispose();
                });
                delete (this._fills[index]);
            }
            if (strokes) {
                $array.each(strokes, (item) => {
                    this.strokes.removeValue(item);
                    item.dispose();
                });
                delete (this._strokes[index]);
            }
        }
    }
}
Object.defineProperty(FibonacciSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "FibonacciSeries"
});
Object.defineProperty(FibonacciSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: SimpleLineSeries.classNames.concat([FibonacciSeries.className])
});
//# sourceMappingURL=FibonacciSeries.js.map
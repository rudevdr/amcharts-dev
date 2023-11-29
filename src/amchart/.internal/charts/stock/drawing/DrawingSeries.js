import { LineSeries } from "../../xy/series/LineSeries";
import { Bullet } from "../../../core/render/Bullet";
import { Circle } from "../../../core/render/Circle";
import { Container } from "../../../core/render/Container";
import { Template } from "../../../core/util/Template";
import { ListTemplate } from "../../../core/util/List";
import * as $array from "../../../core/util/Array";
import * as $time from "../../../core/util/Time";
import * as $type from "../../../core/util/Type";
import * as $math from "../../../core/util/Math";
import * as $object from "../../../core/util/Object";
export class DrawingSeries extends LineSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_clickDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_moveDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_downDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_upDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_drawingEnabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_isDragging", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_clickPointerPoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_movePointerPoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_isDrawing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_isPointerDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
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
        Object.defineProperty(this, "_dragStartPX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_dragStartY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_dvpX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_dvY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_isHover", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_erasingEnabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_movePoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { x: 0, y: 0 }
        });
        Object.defineProperty(this, "grips", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Container._new(this._root, {
                themeTags: ["grip"],
                setStateOnChildren: true,
                draggable: true
            }, [this.grips.template]))
        });
        Object.defineProperty(this, "circles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Circle._new(this._root, {}, [this.circles.template]))
        });
        Object.defineProperty(this, "outerCircles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Circle._new(this._root, {
                themeTags: ["outline"]
            }, [this.outerCircles.template]))
        });
    }
    _afterNew() {
        this.addTag("drawing");
        this.setPrivate("allowChangeSnap", true);
        if (this._tag) {
            this.addTag(this._tag);
        }
        this.set("valueYField", "valueY");
        this.set("valueXField", "valueX");
        super._afterNew();
        this.set("connect", false);
        this.set("autoGapCount", Infinity);
        this.set("ignoreMinMax", true);
        this.set("groupDataDisabled", true);
        const strokesTemplate = this.strokes.template;
        strokesTemplate.set("templateField", "stroke");
        const fillsTemplate = this.fills.template;
        fillsTemplate.setAll({ templateField: "fill" });
        fillsTemplate.events.on("dragstart", (e) => {
            this._handleFillDragStart(e, this._getIndex(e.target));
            this._isPointerDown = true;
        });
        fillsTemplate.events.on("pointerdown", (e) => {
            const index = this._getIndex(e.target);
            if (this._erasingEnabled) {
                this._disposeIndex(index);
            }
            else {
                const originalEvent = e.originalEvent;
                if (!originalEvent.button && this._drawingEnabled) {
                    this._handlePointerDown(e);
                }
            }
            const stroke = this.strokes.getIndex(this._getStrokeIndex(index));
            if (stroke) {
                stroke.dragStart(e);
            }
        });
        strokesTemplate.events.on("pointerdown", (e) => {
            if (this._erasingEnabled) {
                this._disposeIndex(this._getIndex(e.target));
            }
            else {
                const originalEvent = e.originalEvent;
                if (!originalEvent.button && this._drawingEnabled) {
                    this._handlePointerDown(e);
                }
            }
        });
        fillsTemplate.events.on("dragstop", (e) => {
            this._isPointerDown = false;
            const index = this._getIndex(e.target);
            this._handleFillDragStop(e, index);
            const stroke = this.strokes.getIndex(this._getStrokeIndex(index));
            if (stroke) {
                stroke.dragStop(e);
            }
        });
        fillsTemplate.events.on("pointerover", (e) => {
            const index = this._getIndex(e.target);
            const stroke = this.strokes.getIndex(this._getStrokeIndex(index));
            if (stroke) {
                stroke.hover();
            }
            this._isHover = true;
            this._showSegmentBullets(index);
        });
        fillsTemplate.events.on("pointerout", () => {
            this._isHover = false;
            this._hideAllBullets();
        });
        strokesTemplate.events.on("pointerover", (e) => {
            this._isHover = true;
            this._showSegmentBullets(this._getIndex(e.target));
        });
        strokesTemplate.events.on("pointerout", () => {
            this._isHover = false;
            this._hideAllBullets();
        });
        strokesTemplate.events.on("dragstop", (e) => {
            this._handleFillDragStop(e, this._getIndex(e.target));
        });
        strokesTemplate.events.on("dragstart", (e) => {
            this._handleFillDragStart(e, this._getIndex(e.target));
        });
        this.bulletsContainer.states.create("hidden", { visible: true, opacity: 0 });
        this.bullets.push((_root, _series, dataItem) => {
            const dataContext = dataItem.dataContext;
            const index = dataContext.index;
            const di = this._di[index]["e"];
            let color = this.get("strokeColor", this.get("stroke"));
            if (di) {
                const dc = di.dataContext;
                if (dc) {
                    const strokeTemplate = dc.stroke;
                    if (strokeTemplate) {
                        color = strokeTemplate.get("stroke");
                    }
                }
            }
            const container = this.grips.make();
            this.grips.push(container);
            const circle = container.children.push(this.circles.make());
            this.circles.push(circle);
            circle.set("stroke", color);
            const outerCircle = container.children.push(this.outerCircles.make());
            this.outerCircles.push(outerCircle);
            outerCircle.set("stroke", color);
            container.events.on("pointerover", (event) => {
                const dataItem = event.target.dataItem;
                if (dataItem) {
                    const dataContext = dataItem.dataContext;
                    this._showSegmentBullets(dataContext.index);
                }
            });
            container.events.on("pointerout", () => {
                this._hideAllBullets();
            });
            this._addBulletInteraction(container);
            this._tweakBullet(container, dataItem);
            return Bullet.new(this._root, {
                locationX: undefined,
                sprite: container
            });
        });
        this.events.on("pointerover", () => {
            this._handlePointerOver();
        });
        this.events.on("pointerout", () => {
            this._handlePointerOut();
        });
    }
    _disposeIndex(index) {
        const dataItems = this._di[index];
        if (dataItems) {
            $object.each(dataItems, (_key, dataItem) => {
                this.data.removeValue(dataItem.dataContext);
            });
        }
    }
    _afterDataChange() {
        $array.each(this.dataItems, (dataItem) => {
            const dataContext = dataItem.dataContext;
            const index = dataContext.index;
            const corner = dataContext.corner;
            if (index != undefined) {
                if (this._di[index] == undefined) {
                    this._di[index] = {};
                }
                this._createElements(index, dataItem);
                this._di[index][corner] = dataItem;
                this._index = index;
            }
        });
    }
    _createElements(_index, _dataItem) {
    }
    clearDrawings() {
        $array.each(this._di, (_dataItems, index) => {
            this._disposeIndex(index);
        });
        this.data.setAll([]);
        this._index = 0;
    }
    _getIndex(sprite) {
        const userData = sprite.get("userData");
        if (userData && userData.length > 0) {
            const dataItem = this.dataItems[userData[0]];
            if (dataItem) {
                const dataContext = dataItem.dataContext;
                if (dataContext) {
                    return dataContext.index;
                }
            }
        }
        return 0;
    }
    _getStrokeIndex(index) {
        let i = 0;
        let c = index;
        this.strokes.each((stroke) => {
            const strokeIndex = this._getIndex(stroke);
            if (strokeIndex == index) {
                c = i;
            }
            i++;
        });
        return c;
    }
    setInteractive(value) {
        this.strokes.template.set("forceInactive", !value);
        this.fills.template.set("forceInactive", !value);
        this.grips.template.set("forceInactive", !value);
        this.circles.template.set("forceInactive", !value);
        this.outerCircles.template.set("forceInactive", !value);
    }
    _showSegmentBullets(index) {
        const dataItems = this._di[index];
        if (dataItems) {
            $object.each(dataItems, (_key, dataItem) => {
                const bullets = dataItem.bullets;
                if (bullets) {
                    $array.each(bullets, (bullet) => {
                        const sprite = bullet.get("sprite");
                        if (sprite) {
                            sprite.show();
                        }
                    });
                }
            });
        }
    }
    _hideAllBullets() {
        this.strokes.each((stroke) => {
            stroke.unhover();
        });
        if (!this._drawingEnabled && !this._isDragging) {
            const dataItems = this.dataItems;
            $array.each(dataItems, (dataItem) => {
                const bullets = dataItem.bullets;
                if (bullets) {
                    $array.each(bullets, (bullet) => {
                        const sprite = bullet.get("sprite");
                        if (sprite) {
                            sprite.hide();
                        }
                    });
                }
            });
        }
    }
    showAllBullets() {
        $array.each(this.dataItems, (dataItem) => {
            const bullets = dataItem.bullets;
            if (bullets) {
                $array.each(bullets, (bullet) => {
                    const sprite = bullet.get("sprite");
                    if (sprite) {
                        sprite.show();
                    }
                });
            }
        });
    }
    _handleFillDragStart(event, index) {
        const chart = this.chart;
        if (chart) {
            const xAxis = this.get("xAxis");
            const yAxis = this.get("yAxis");
            const point = chart.plotContainer.toLocal(event.point);
            this._dragStartPX = xAxis.coordinateToPosition(point.x);
            const valueXns = xAxis.positionToValue(this._dragStartPX);
            this._dragStartY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(point.y)), valueXns);
            const dataItems = this._di[index];
            if (dataItems) {
                $object.each(dataItems, (key, dataItem) => {
                    this._dvpX[key] = xAxis.valueToPosition(dataItem.get("valueX", 0));
                    this._dvY[key] = dataItem.get("valueY");
                });
            }
        }
    }
    _handleFillDragStop(event, index) {
        const chart = this.chart;
        if (chart) {
            const point = chart.plotContainer.toLocal(event.point);
            const xAxis = this.get("xAxis");
            const yAxis = this.get("yAxis");
            const posX = xAxis.coordinateToPosition(point.x);
            const valueXns = xAxis.positionToValue(xAxis.coordinateToPosition(point.x));
            const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(point.y)), valueXns);
            const dpx = posX - this._dragStartPX;
            const dy = valueY - this._dragStartY;
            event.target.setAll({
                x: 0, y: 0
            });
            const dataItems = this._di[index];
            if (dataItems) {
                $object.each(dataItems, (key, dataItem) => {
                    const dvpx = this._dvpX[key];
                    const dvy = this._dvY[key];
                    if ($type.isNumber(dvpx) && $type.isNumber(dvy)) {
                        const vpx = dvpx + dpx;
                        const vxns = xAxis.positionToValue(vpx);
                        const vx = this._getXValue(vxns);
                        let vy = dvy + dy;
                        const yAxis = this.get("yAxis");
                        const roundTo = yAxis.getPrivate("stepDecimalPlaces", 0) + 1;
                        vy = $math.round(vy, roundTo);
                        vy = this._getYValue(vy, vxns);
                        this._setContext(dataItem, "valueX", vx);
                        this._setContext(dataItem, "valueY", vy, true);
                        this._setXLocation(dataItem, vx);
                    }
                });
            }
        }
        this._updateSegment(index);
    }
    _updateSegment(_index) {
        this._updateElements();
    }
    _updateChildren() {
        this._updateElements();
        if (this._valuesDirty) {
            this.markDirtyDrawings();
        }
        super._updateChildren();
    }
    _updateElements() {
    }
    markDirtyDrawings() {
        const xAxis = this.get("xAxis");
        if (xAxis) {
            const panel = xAxis.chart;
            if (panel) {
                const stockChart = panel.getPrivate("stockChart");
                if (stockChart) {
                    stockChart.markDirtyDrawings();
                }
            }
        }
    }
    _getFillTemplate() {
        const fillTemplate = {};
        const fillColor = this.get("fillColor");
        if (fillColor != null) {
            fillTemplate.fill = fillColor;
        }
        const fillOpacity = this.get("fillOpacity");
        if (fillOpacity != null) {
            fillTemplate.fillOpacity = fillOpacity;
        }
        return Template.new(fillTemplate);
    }
    _getStrokeTemplate() {
        const strokeTemplate = {};
        const strokeColor = this.get("strokeColor");
        if (strokeColor != null) {
            strokeTemplate.stroke = strokeColor;
        }
        const strokeOpacity = this.get("strokeOpacity");
        if (strokeOpacity != null) {
            strokeTemplate.strokeOpacity = strokeOpacity;
        }
        const strokeDasharray = this.get("strokeDasharray");
        if (strokeDasharray != null) {
            strokeTemplate.strokeDasharray = strokeDasharray;
        }
        const strokeWidth = this.get("strokeWidth");
        if (strokeWidth != null) {
            strokeTemplate.strokeWidth = strokeWidth;
        }
        return Template.new(strokeTemplate);
    }
    _tweakBullet(_container, _dataItem) {
    }
    _addBulletInteraction(sprite) {
        sprite.events.on("dragged", (e) => {
            this._handleBulletDragged(e);
            this._isDragging = true;
        });
        sprite.events.on("dragstart", (e) => {
            this._handleBulletDragStart(e);
        });
        sprite.events.on("dragstop", (e) => {
            this._handleBulletDragStop(e);
            this.setTimeout(() => {
                this._isDragging = false;
            }, 100);
        });
        sprite.events.on("click", (e) => {
            if (this._erasingEnabled) {
                const dataItem = e.target.dataItem;
                if (dataItem) {
                    const dataContext = dataItem.dataContext;
                    if (dataContext) {
                        this._disposeIndex(dataContext.index);
                    }
                }
            }
            else {
                this._handlePointerClick(e);
            }
        });
    }
    _handlePointerClick(event) {
        if (this._drawingEnabled) {
            const chart = this.chart;
            if (chart) {
                this._clickPointerPoint = chart.plotContainer.toLocal(event.point);
            }
        }
    }
    // need this in order bullets not to be placed to the charts bullets container
    _placeBulletsContainer() {
        this.children.moveValue(this.bulletsContainer);
        this.enableDrawing();
        this.disableDrawing();
    }
    _handleBulletDragged(event) {
        const dataItem = event.target.dataItem;
        const chart = this.chart;
        if (chart) {
            const target = event.target;
            const point = { x: target.x(), y: target.y() };
            this._handleBulletDraggedReal(dataItem, point);
        }
        const dataContext = dataItem.dataContext;
        if (dataContext) {
            const index = dataContext.index;
            this._updateSegment(index);
        }
    }
    _handleBulletDraggedReal(dataItem, point) {
        const xAxis = this.get("xAxis");
        const yAxis = this.get("yAxis");
        const valueXns = xAxis.positionToValue(xAxis.coordinateToPosition(point.x));
        const valueX = this._getXValue(valueXns);
        const valueY = this._getYValue(yAxis.positionToValue(yAxis.coordinateToPosition(point.y)), valueXns);
        this._setContext(dataItem, "valueX", valueX);
        this._setContext(dataItem, "valueY", valueY, true);
        this._setXLocation(dataItem, valueX);
        this._positionBullets(dataItem);
    }
    _handleBulletDragStart(_event) {
    }
    _handleBulletDragStop(_event) {
    }
    _handlePointerOver() {
    }
    _handlePointerOut() {
    }
    enableDrawing() {
        const chart = this.chart;
        this._erasingEnabled = false;
        this._drawingEnabled = true;
        if (chart) {
            if (!this._clickDp) {
                this._clickDp = chart.plotContainer.events.on("click", (e) => {
                    const originalEvent = e.originalEvent;
                    if (!originalEvent.button && !this._erasingEnabled) {
                        this._handlePointerClick(e);
                    }
                });
            }
            if (!this._downDp) {
                this._downDp = chart.plotContainer.events.on("pointerdown", (e) => {
                    const originalEvent = e.originalEvent;
                    if (!originalEvent.button && !this._erasingEnabled) {
                        this._handlePointerDown(e);
                    }
                });
            }
            if (!this._upDp) {
                this._upDp = chart.plotContainer.events.on("globalpointerup", (e) => {
                    const originalEvent = e.originalEvent;
                    if (!originalEvent.button && !this._erasingEnabled) {
                        this._handlePointerUp(e);
                    }
                });
            }
            if (!this._moveDp) {
                this._moveDp = chart.plotContainer.events.on("globalpointermove", (e) => {
                    if (!this._erasingEnabled) {
                        if (e.point.x != this._movePoint.x || e.point.y != this._movePoint.y) {
                            this._handlePointerMove(e);
                        }
                    }
                });
            }
        }
    }
    enableErasing() {
        this._erasingEnabled = true;
    }
    disableErasing() {
        this._erasingEnabled = false;
    }
    disableDrawing() {
        this._erasingEnabled = false;
        this._drawingEnabled = false;
        this._isDrawing = false;
        if (this._clickDp) {
            this._clickDp.dispose();
            this._clickDp = undefined;
        }
        if (this._downDp) {
            this._downDp.dispose();
            this._downDp = undefined;
        }
        if (this._upDp) {
            this._upDp.dispose();
            this._upDp = undefined;
        }
        this._hideAllBullets();
    }
    _handlePointerMove(event) {
        const chart = this.chart;
        if (chart) {
            this._movePointerPoint = chart.plotContainer.toLocal(event.point);
        }
    }
    _handlePointerDown(_event) {
        this._isPointerDown = true;
    }
    _handlePointerUp(_event) {
        this._isPointerDown = false;
    }
    startIndex() {
        return 0;
    }
    endIndex() {
        return this.dataItems.length;
    }
    _setXLocation(dataItem, value) {
        if (!this.get("snapToData")) {
            this._setXLocationReal(dataItem, value);
        }
        else {
            dataItem.set("locationX", undefined);
        }
    }
    _setXLocationReal(dataItem, value) {
        const xAxis = this.get("xAxis");
        const baseInterval = xAxis.getPrivate("baseInterval");
        const root = this._root;
        const firstDayOfWeek = root.locale.firstDayOfWeek;
        const open = $time.round(new Date(value), baseInterval.timeUnit, baseInterval.count, firstDayOfWeek, root.utc, undefined, root.timezone).getTime();
        let close = open + $time.getDuration(baseInterval.timeUnit, baseInterval.count * 1.05);
        close = $time.round(new Date(close), baseInterval.timeUnit, baseInterval.count, firstDayOfWeek, root.utc, undefined, root.timezone).getTime();
        const locationX = (value - open) / (close - open);
        dataItem.set("locationX", locationX);
    }
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        const dataContext = dataItem.dataContext;
        if (dataContext) {
            const index = dataContext.index;
            this.markDirtyValues();
            const dataItems = this._di[index];
            if (dataItems) {
                $object.each(dataItems, (_key, dataItem) => {
                    super.disposeDataItem(dataItem);
                });
            }
            delete this._di[index];
        }
    }
    _getYValue(value, valueX) {
        const series = this.get("series");
        if (this.get("snapToData") && series) {
            const field = this.get("field", "value") + "Y";
            return this._snap(valueX, value, field, series);
        }
        else {
            if (this.get("valueYShow") == "valueYChangeSelectionPercent") {
                const baseValueSeries = this.getPrivate("baseValueSeries");
                if (baseValueSeries) {
                    const baseValue = baseValueSeries._getBase("valueY");
                    value = value / 100 * baseValue + baseValue;
                }
            }
            const yAxis = this.get("yAxis");
            const roundTo = yAxis.getPrivate("stepDecimalPlaces", 0) + 1;
            return $math.round(value, roundTo);
        }
    }
    _getXValue(value) {
        const series = this.get("series");
        if (this.get("snapToData") && series) {
            const xAxis = this.get("xAxis");
            const min = xAxis.getPrivate("min", 0) + 1;
            const max = xAxis.getPrivate("max", 1) - 1;
            value = $math.fitToRange(value, min, max);
            value = this._snap(value, value, "valueX", series) + 1; // important!
            return value;
        }
        else {
            return Math.round(value);
        }
    }
    _setContext(dataItem, key, value, working) {
        dataItem.set(key, value);
        if (working) {
            dataItem.set(key + "Working", value);
        }
        const dataContext = dataItem.dataContext;
        const field = this.get(key + "Field");
        if (field) {
            dataContext[field] = value;
        }
    }
    _snap(value, realValue, key, series) {
        const xAxis = this.get("xAxis");
        const dataItem = xAxis.getSeriesItem(series, Math.max(0, xAxis.valueToPosition(value)), 0.5, true);
        if (dataItem) {
            return dataItem.get(key);
        }
        return realValue;
    }
}
Object.defineProperty(DrawingSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "DrawingSeries"
});
Object.defineProperty(DrawingSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: LineSeries.classNames.concat([DrawingSeries.className])
});
//# sourceMappingURL=DrawingSeries.js.map
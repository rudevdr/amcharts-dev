import { __awaiter } from "tslib";
import { DataItem } from "../../../core/render/Component";
import { Series } from "../../../core/render/Series";
import { List } from "../../../core/util/List";
import { Container } from "../../../core/render/Container";
import { Graphics } from "../../../core/render/Graphics";
import * as $type from "../../../core/util/Type";
import * as $object from "../../../core/util/Object";
import * as $array from "../../../core/util/Array";
import * as $utils from "../../../core/util/Utils";
/**
 * @ignore
 */
function min(left, right) {
    if (left == null) {
        return right;
    }
    else if (right == null) {
        return left;
    }
    else if (right < left) {
        return right;
    }
    else {
        return left;
    }
}
/**
 * @ignore
 */
function max(left, right) {
    if (left == null) {
        return right;
    }
    else if (right == null) {
        return left;
    }
    else if (right > left) {
        return right;
    }
    else {
        return left;
    }
}
/**
 * A base class for all XY chart series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/} for more info
 */
export class XYSeries extends Series {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_xField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_yField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_xOpenField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_yOpenField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_xLowField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_xHighField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_yLowField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_yHighField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_axesDirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_stackDirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_selectionProcessed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_dataSets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_mainContainerMask", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_bullets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        /**
         * A [[Container]] that us used to put series' elements in.
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "mainContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, {}))
        });
        /**
         * A list of axis ranges that affect the series.
         *
         * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/} for more info
         */
        Object.defineProperty(this, "axisRanges", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new List()
        });
        Object.defineProperty(this, "_skipped", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_couldStackTo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_reallyStackedTo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_stackedSeries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_aLocationX0", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_aLocationX1", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "_aLocationY0", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_aLocationY1", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "_showBullets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "valueXFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "valueX",
                "openValueX",
                "lowValueX",
                "highValueX"
            ]
        });
        Object.defineProperty(this, "valueYFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "valueY",
                "openValueY",
                "lowValueY",
                "highValueY"
            ]
        });
        Object.defineProperty(this, "_valueXFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_valueYFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // used for full min/max
        Object.defineProperty(this, "_valueXShowFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_valueYShowFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // used for selection (uses working)
        Object.defineProperty(this, "__valueXShowFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "__valueYShowFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_emptyDataItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new DataItem(this, undefined, {})
        });
        Object.defineProperty(this, "_dataSetId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tooltipFieldX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tooltipFieldY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_posXDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_posYDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        this.fields.push("categoryX", "categoryY", "openCategoryX", "openCategoryY");
        this.valueFields.push("valueX", "valueY", "openValueX", "openValueY", "lowValueX", "lowValueY", "highValueX", "highValueY");
        this._setRawDefault("vcx", 1);
        this._setRawDefault("vcy", 1);
        // this can't go to themes, as data might be parsed before theme
        this._setRawDefault("valueXShow", "valueXWorking");
        this._setRawDefault("valueYShow", "valueYWorking");
        this._setRawDefault("openValueXShow", "openValueXWorking");
        this._setRawDefault("openValueYShow", "openValueYWorking");
        this._setRawDefault("lowValueXShow", "lowValueXWorking");
        this._setRawDefault("lowValueYShow", "lowValueYWorking");
        this._setRawDefault("highValueXShow", "highValueXWorking");
        this._setRawDefault("highValueYShow", "highValueYWorking");
        this._setRawDefault("lowValueXGrouped", "low");
        this._setRawDefault("lowValueYGrouped", "low");
        this._setRawDefault("highValueXGrouped", "high");
        this._setRawDefault("highValueYGrouped", "high");
        super._afterNew();
        this.set("maskContent", true);
        this._disposers.push(this.axisRanges.events.onAll((change) => {
            if (change.type === "clear") {
                $array.each(change.oldValues, (axisRange) => {
                    this._removeAxisRange(axisRange);
                });
            }
            else if (change.type === "push") {
                this._processAxisRange(change.newValue);
            }
            else if (change.type === "setIndex") {
                this._processAxisRange(change.newValue);
            }
            else if (change.type === "insertIndex") {
                this._processAxisRange(change.newValue);
            }
            else if (change.type === "removeIndex") {
                this._removeAxisRange(change.oldValue);
            }
            else if (change.type === "moveIndex") {
                this._processAxisRange(change.value);
            }
            else {
                throw new Error("Unknown IStreamEvent type");
            }
        }));
        this.states.create("hidden", { opacity: 1, visible: false });
        this._makeFieldNames();
    }
    _processAxisRange(axisRange) {
        const container = Container.new(this._root, {});
        axisRange.container = container;
        this.children.push(container);
        axisRange.series = this;
        const axisDataItem = axisRange.axisDataItem;
        axisDataItem.setRaw("isRange", true);
        const axis = axisDataItem.component;
        if (axis) {
            axis._processAxisRange(axisDataItem, ["range", "series"]);
            const bullet = axisDataItem.get("bullet");
            if (bullet) {
                const sprite = bullet.get("sprite");
                if (sprite) {
                    sprite.setPrivate("visible", false);
                }
            }
            const axisFill = axisDataItem.get("axisFill");
            if (axisFill) {
                container.set("mask", axisFill);
            }
            axis._seriesAxisRanges.push(axisDataItem);
        }
    }
    _removeAxisRange(axisRange) {
        const axisDataItem = axisRange.axisDataItem;
        const axis = axisDataItem.component;
        axis.disposeDataItem(axisDataItem);
        $array.remove(axis._seriesAxisRanges, axisDataItem);
        const container = axisRange.container;
        if (container) {
            container.dispose();
        }
    }
    _updateFields() {
        super._updateFields();
        this._valueXFields = [];
        this._valueYFields = [];
        this._valueXShowFields = [];
        this._valueYShowFields = [];
        this.__valueXShowFields = [];
        this.__valueYShowFields = [];
        if (this.valueXFields) {
            $array.each(this.valueXFields, (key) => {
                const field = this.get((key + "Field"));
                if (field) {
                    this._valueXFields.push(key);
                    let field = this.get((key + "Show"));
                    this.__valueXShowFields.push(field);
                    if (field.indexOf("Working") != -1) {
                        this._valueXShowFields.push(field.split("Working")[0]);
                    }
                    else {
                        this._valueXShowFields.push(field);
                    }
                }
            });
        }
        if (this.valueYFields) {
            $array.each(this.valueYFields, (key) => {
                const field = this.get((key + "Field"));
                if (field) {
                    this._valueYFields.push(key);
                    let field = this.get((key + "Show"));
                    this.__valueYShowFields.push(field);
                    if (field.indexOf("Working") != -1) {
                        this._valueYShowFields.push(field.split("Working")[0]);
                    }
                    else {
                        this._valueYShowFields.push(field);
                    }
                }
            });
        }
    }
    _dispose() {
        super._dispose();
        this._bullets = {};
        const chart = this.chart;
        if (chart) {
            chart.series.removeValue(this);
        }
        $array.removeFirst(this.get("xAxis").series, this);
        $array.removeFirst(this.get("yAxis").series, this);
    }
    // TODO use  SelectKeys<this["_privateSettings"], number | undefined>
    _min(key, value) {
        let newValue = min(this.getPrivate(key), value);
        this.setPrivate(key, newValue);
    }
    // TODO use  SelectKeys<this["_privateSettings"], number | undefined>
    _max(key, value) {
        let newValue = max(this.getPrivate(key), value);
        this.setPrivate(key, newValue);
    }
    _shouldMakeBullet(dataItem) {
        const xAxis = this.get("xAxis");
        const yAxis = this.get("yAxis");
        const baseAxis = this.get("baseAxis");
        if (!xAxis.inited || !yAxis.inited) {
            return false;
        }
        const minBulletDistance = this.get("minBulletDistance", 0);
        if (minBulletDistance > 0) {
            let startIndex = this.startIndex();
            let endIndex = this.endIndex();
            let count = endIndex - startIndex;
            if (xAxis == baseAxis) {
                if (xAxis.get("renderer").axisLength() / count < minBulletDistance / 5) {
                    return false;
                }
            }
            else if (yAxis == baseAxis) {
                if (yAxis.get("renderer").axisLength() / count < minBulletDistance / 5) {
                    return false;
                }
            }
        }
        if (dataItem.get(this._xField) != null && dataItem.get(this._yField) != null) {
            return true;
        }
        return false;
    }
    _makeFieldNames() {
        const xAxis = this.get("xAxis");
        const yAxis = this.get("yAxis");
        const xName = xAxis.getPrivate("name");
        const xCapName = $utils.capitalizeFirst(xName);
        const yName = yAxis.getPrivate("name");
        const yCapName = $utils.capitalizeFirst(yName);
        const xLetter = xAxis.get("renderer").getPrivate("letter");
        const yLetter = yAxis.get("renderer").getPrivate("letter");
        const open = "open";
        const low = "low";
        const high = "high";
        const show = "Show";
        if (xAxis.className === "ValueAxis") {
            this._xField = this.get((xName + xLetter + show));
            this._xOpenField = this.get((open + xCapName + xLetter + show));
            this._xLowField = this.get((low + xCapName + xLetter + show));
            this._xHighField = this.get((high + xCapName + xLetter + show));
        }
        else {
            this._xField = (xName + xLetter);
            this._xOpenField = (open + xCapName + xLetter);
            this._xLowField = (low + xCapName + xLetter);
            this._xHighField = (high + xCapName + xLetter);
        }
        if (yAxis.className === "ValueAxis") {
            this._yField = this.get((yName + yLetter + show));
            this._yOpenField = this.get((open + yCapName + yLetter + show));
            this._yLowField = this.get((low + yCapName + yLetter + show));
            this._yHighField = this.get((high + yCapName + yLetter + show));
        }
        else {
            this._yField = (yName + yLetter);
            this._yOpenField = (open + yCapName + yLetter);
            this._yLowField = (low + yCapName + yLetter);
            this._yHighField = (high + yCapName + yLetter);
        }
    }
    _fixVC() {
        const xAxis = this.get("xAxis");
        const yAxis = this.get("yAxis");
        const baseAxis = this.get("baseAxis");
        const hiddenState = this.states.lookup("hidden");
        const sequencedInterpolation = this.get("sequencedInterpolation");
        if (hiddenState) {
            let value = 0;
            if (sequencedInterpolation) {
                value = 0.999999999999; // makes animate, good for stacked
            }
            if (xAxis === baseAxis) {
                hiddenState.set("vcy", value);
            }
            else if (yAxis === baseAxis) {
                hiddenState.set("vcx", value);
            }
            else {
                hiddenState.set("vcy", value);
                hiddenState.set("vcx", value);
            }
        }
    }
    _handleMaskBullets() {
        if (this.isDirty("maskBullets")) {
            this.bulletsContainer.set("maskContent", this.get("maskBullets"));
        }
    }
    _fixPosition() {
        const xAxis = this.get("xAxis");
        const yAxis = this.get("yAxis");
        this.set("x", xAxis.x() - $utils.relativeToValue(xAxis.get("centerX", 0), xAxis.width()) - xAxis.parent.get("paddingLeft", 0));
        this.set("y", yAxis.y() - $utils.relativeToValue(yAxis.get("centerY", 0), yAxis.height()) - yAxis.parent.get("paddingTop", 0));
        this.bulletsContainer.set("y", this.y());
        this.bulletsContainer.set("x", this.x());
    }
    _prepareChildren() {
        super._prepareChildren();
        this._bullets = {};
        if (this.isDirty("valueYShow") || this.isDirty("valueXShow") || this.isDirty("openValueYShow") || this.isDirty("openValueXShow") || this.isDirty("lowValueYShow") || this.isDirty("lowValueXShow") || this.isDirty("highValueYShow") || this.isDirty("highValueXShow")) {
            this._updateFields();
            this._makeFieldNames();
            this._valuesDirty = true;
        }
        if (this.isDirty("xAxis") || this.isDirty("yAxis")) {
            this._valuesDirty = true;
        }
        this.set("width", this.get("xAxis").width());
        this.set("height", this.get("yAxis").height());
        this._handleMaskBullets();
        const xAxis = this.get("xAxis");
        const yAxis = this.get("yAxis");
        const baseAxis = this.get("baseAxis");
        const tooltipPositionX = this.get("tooltipPositionX");
        let tooltipFieldX;
        switch (tooltipPositionX) {
            case "open":
                tooltipFieldX = this._xOpenField;
                break;
            case "low":
                tooltipFieldX = this._xLowField;
                break;
            case "high":
                tooltipFieldX = this._xHighField;
                break;
            default:
                tooltipFieldX = this._xField;
        }
        this._tooltipFieldX = tooltipFieldX;
        const tooltipPositionY = this.get("tooltipPositionY");
        let tooltipFieldY;
        switch (tooltipPositionY) {
            case "open":
                tooltipFieldY = this._yOpenField;
                break;
            case "low":
                tooltipFieldY = this._yLowField;
                break;
            case "high":
                tooltipFieldY = this._yHighField;
                break;
            default:
                tooltipFieldY = this._yField;
        }
        this._tooltipFieldY = tooltipFieldY;
        if (this.isDirty("baseAxis")) {
            this._fixVC();
        }
        this._fixPosition();
        const stacked = this.get("stacked");
        if (this.isDirty("stacked")) {
            if (stacked) {
                if (this._valuesDirty && !this._dataProcessed) {
                }
                else {
                    this._stack();
                }
            }
            else {
                this._unstack();
            }
        }
        if (this._valuesDirty && !this._dataProcessed) {
            this._dataProcessed = true;
            if (stacked) {
                this._stack();
            }
            $array.each(this.dataItems, (dataItem) => {
                $array.each(this._valueXShowFields, (key) => {
                    let value = dataItem.get(key);
                    if (value != null) {
                        if (stacked) {
                            value += this.getStackedXValue(dataItem, key);
                        }
                        this._min("minX", value);
                        this._max("maxX", value);
                    }
                });
                $array.each(this._valueYShowFields, (key) => {
                    let value = dataItem.get(key);
                    if (value != null) {
                        if (stacked) {
                            value += this.getStackedYValue(dataItem, key);
                        }
                        this._min("minY", value);
                        this._max("maxY", value);
                    }
                });
                xAxis.processSeriesDataItem(dataItem, this._valueXFields);
                yAxis.processSeriesDataItem(dataItem, this._valueYFields);
            });
            xAxis._seriesValuesDirty = true;
            yAxis._seriesValuesDirty = true;
            if (!this.get("ignoreMinMax")) {
                if (this.isPrivateDirty("minX") || this.isPrivateDirty("maxX")) {
                    xAxis.markDirtyExtremes();
                }
                if (this.isPrivateDirty("minY") || this.isPrivateDirty("maxY")) {
                    yAxis.markDirtyExtremes();
                }
            }
            this._markStakedDirtyStack();
            //this.updateLegendMarker(undefined); // causes legend marker to change color instantly when on
            if (!this.get("tooltipDataItem")) {
                this.updateLegendValue(undefined);
            }
        }
        if (this.isDirty("vcx") || this.isDirty("vcy")) {
            this._markStakedDirtyStack();
        }
        if (!this._dataGrouped) {
            xAxis._groupSeriesData(this);
            yAxis._groupSeriesData(this);
            this._dataGrouped = true;
        }
        if (this._valuesDirty || this.isPrivateDirty("startIndex") || this.isPrivateDirty("endIndex") || this.isDirty("vcx") || this.isDirty("vcy") || this._stackDirty) {
            let startIndex = this.startIndex();
            let endIndex = this.endIndex();
            let minBulletDistance = this.get("minBulletDistance", 0);
            if (minBulletDistance > 0 && baseAxis) {
                if (baseAxis.get("renderer").axisLength() / (endIndex - startIndex) > minBulletDistance) {
                    this._showBullets = true;
                }
                else {
                    this._showBullets = false;
                }
            }
            if ((this._psi != startIndex || this._pei != endIndex || this.isDirty("vcx") || this.isDirty("vcy") || this._stackDirty || this._valuesDirty) && !this._selectionProcessed) {
                this._selectionProcessed = true;
                const vcx = this.get("vcx", 1);
                const vcy = this.get("vcy", 1);
                const stacked = this.get("stacked", false);
                const outOfSelection = this.getPrivate("outOfSelection");
                if (baseAxis === xAxis || !baseAxis) {
                    yAxis._calculateTotals();
                    this.setPrivateRaw("selectionMinY", undefined);
                    this.setPrivateRaw("selectionMaxY", undefined);
                    if (!outOfSelection) {
                        for (let i = startIndex; i < endIndex; i++) {
                            this.processYSelectionDataItem(this.dataItems[i], vcy, stacked);
                        }
                    }
                    else {
                        yAxis.markDirtySelectionExtremes();
                    }
                }
                if (baseAxis === yAxis || !baseAxis) {
                    xAxis._calculateTotals();
                    this.setPrivateRaw("selectionMinX", undefined);
                    this.setPrivateRaw("selectionMaxX", undefined);
                    if (!outOfSelection) {
                        for (let i = startIndex; i < endIndex; i++) {
                            this.processXSelectionDataItem(this.dataItems[i], vcx, stacked);
                        }
                    }
                    else {
                        yAxis.markDirtySelectionExtremes();
                    }
                }
                if (baseAxis === xAxis || !baseAxis) {
                    if (this.get("valueYShow") !== "valueYWorking") {
                        const selectionMinY = this.getPrivate("selectionMinY");
                        if (selectionMinY != null) {
                            this.setPrivateRaw("minY", selectionMinY);
                            yAxis.markDirtyExtremes();
                        }
                        const selectionMaxY = this.getPrivate("selectionMaxY");
                        if (selectionMaxY != null) {
                            this.setPrivateRaw("maxY", selectionMaxY);
                            yAxis.markDirtyExtremes();
                        }
                    }
                }
                if (baseAxis === yAxis || !baseAxis) {
                    if (this.get("valueXShow") !== "valueXWorking") {
                        const selectionMinX = this.getPrivate("selectionMinX");
                        if (selectionMinX != null) {
                            this.setPrivateRaw("minX", selectionMinX);
                            yAxis.markDirtyExtremes();
                        }
                        const selectionMaxX = this.getPrivate("selectionMaxX");
                        if (selectionMaxX != null) {
                            this.setPrivateRaw("maxX", selectionMaxX);
                            xAxis.markDirtyExtremes();
                        }
                    }
                }
                if (this.isPrivateDirty("selectionMinX") || this.isPrivateDirty("selectionMaxX")) {
                    xAxis.markDirtySelectionExtremes();
                }
                if (this.isPrivateDirty("selectionMinY") || this.isPrivateDirty("selectionMaxY")) {
                    yAxis.markDirtySelectionExtremes();
                }
                // this.updateLegendValue(undefined); flickers while panning
            }
        }
    }
    _makeRangeMask() {
        if (this.axisRanges.length > 0) {
            let mainContainerMask = this._mainContainerMask;
            if (mainContainerMask == null) {
                mainContainerMask = this.children.push(Graphics.new(this._root, {}));
                this._mainContainerMask = mainContainerMask;
                mainContainerMask.set("draw", (display, target) => {
                    const parent = this.parent;
                    if (parent) {
                        const w = this._root.container.width();
                        const h = this._root.container.height();
                        display.moveTo(-w, -h);
                        display.lineTo(-w, h * 2);
                        display.lineTo(w * 2, h * 2);
                        display.lineTo(w * 2, -h);
                        display.lineTo(-w, -h);
                        this.axisRanges.each((axisRange) => {
                            const fill = axisRange.axisDataItem.get("axisFill");
                            if (parent) {
                                if (fill) {
                                    let draw = fill.get("draw");
                                    if (draw) {
                                        draw(display, target);
                                    }
                                }
                            }
                        });
                    }
                    this.mainContainer._display.mask = mainContainerMask._display;
                });
            }
            mainContainerMask.markDirty();
            mainContainerMask._markDirtyKey("fill");
        }
        else {
            this.mainContainer._display.mask = null;
        }
    }
    _updateChildren() {
        super._updateChildren();
        // save for performance
        this._x = this.x();
        this._y = this.y();
        this._makeRangeMask();
    }
    _stack() {
        const chart = this.chart;
        if (chart) {
            const seriesIndex = chart.series.indexOf(this);
            this._couldStackTo = [];
            if (seriesIndex > 0) {
                let series;
                for (let i = seriesIndex - 1; i >= 0; i--) {
                    series = chart.series.getIndex(i);
                    if (series.get("xAxis") === this.get("xAxis") && series.get("yAxis") === this.get("yAxis") && series.className === this.className) {
                        this._couldStackTo.push(series);
                        if (!series.get("stacked")) {
                            break;
                        }
                    }
                }
            }
            this._stackDataItems();
        }
    }
    _unstack() {
        $object.each(this._reallyStackedTo, (_key, value) => {
            delete (value._stackedSeries[this.uid]);
        });
        this._reallyStackedTo = {};
        $array.each(this.dataItems, (dataItem) => {
            dataItem.setRaw("stackToItemY", undefined);
            dataItem.setRaw("stackToItemX", undefined);
        });
    }
    _stackDataItems() {
        // this works only with the same number of data @todo: search by date/category?
        const baseAxis = this.get("baseAxis");
        const xAxis = this.get("xAxis");
        const yAxis = this.get("yAxis");
        let field;
        let stackToItemKey;
        if (baseAxis === xAxis) {
            field = "valueY";
            stackToItemKey = "stackToItemY";
        }
        else if (baseAxis === yAxis) {
            field = "valueX";
            stackToItemKey = "stackToItemX";
        }
        let len = this._couldStackTo.length;
        let index = 0;
        const stackToNegative = this.get("stackToNegative");
        this._reallyStackedTo = {};
        $array.each(this.dataItems, (dataItem) => {
            for (let s = 0; s < len; s++) {
                let stackToSeries = this._couldStackTo[s];
                let stackToItem = stackToSeries.dataItems[index];
                let value = dataItem.get(field);
                if (stackToItem) {
                    let stackValue = stackToItem.get(field);
                    if (stackToNegative) {
                        if ($type.isNumber(value)) {
                            if ($type.isNumber(stackValue)) {
                                if (value >= 0 && stackValue >= 0) {
                                    dataItem.setRaw(stackToItemKey, stackToItem);
                                    this._reallyStackedTo[stackToSeries.uid] = stackToSeries;
                                    stackToSeries._stackedSeries[this.uid] = this;
                                    break;
                                }
                                if (value < 0 && stackValue < 0) {
                                    dataItem.setRaw(stackToItemKey, stackToItem);
                                    this._reallyStackedTo[stackToSeries.uid] = stackToSeries;
                                    stackToSeries._stackedSeries[this.uid] = this;
                                    break;
                                }
                            }
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        if ($type.isNumber(value) && $type.isNumber(stackValue)) {
                            dataItem.setRaw(stackToItemKey, stackToItem);
                            this._reallyStackedTo[stackToSeries.uid] = stackToSeries;
                            stackToSeries._stackedSeries[this.uid] = this;
                            break;
                        }
                    }
                }
            }
            index++;
        });
    }
    processXSelectionDataItem(dataItem, vcx, stacked) {
        $array.each(this.__valueXShowFields, (key) => {
            let value = dataItem.get(key);
            if (value != null) {
                if (stacked) {
                    value += this.getStackedXValueWorking(dataItem, key);
                }
                this._min("selectionMinX", value);
                this._max("selectionMaxX", value * vcx);
            }
        });
    }
    processYSelectionDataItem(dataItem, vcy, stacked) {
        $array.each(this.__valueYShowFields, (key) => {
            let value = dataItem.get(key);
            if (value != null) {
                if (stacked) {
                    value += this.getStackedYValueWorking(dataItem, key);
                }
                this._min("selectionMinY", value);
                this._max("selectionMaxY", value * vcy);
            }
        });
    }
    /**
     * @ignore
     */
    getStackedYValueWorking(dataItem, key) {
        const stackToItem = dataItem.get("stackToItemY");
        if (stackToItem) {
            const stackedToSeries = stackToItem.component;
            return stackToItem.get(key, 0) * stackedToSeries.get("vcy", 1) + this.getStackedYValueWorking(stackToItem, key);
        }
        return 0;
    }
    /**
     * @ignore
     */
    getStackedXValueWorking(dataItem, key) {
        const stackToItem = dataItem.get("stackToItemX");
        if (stackToItem) {
            const stackedToSeries = stackToItem.component;
            return stackToItem.get(key, 0) * stackedToSeries.get("vcx", 1) + this.getStackedXValueWorking(stackToItem, key);
        }
        return 0;
    }
    /**
     * @ignore
     */
    getStackedYValue(dataItem, key) {
        const stackToItem = dataItem.get("stackToItemY");
        if (stackToItem) {
            return stackToItem.get(key, 0) + this.getStackedYValue(stackToItem, key);
        }
        return 0;
    }
    /**
     * @ignore
     */
    getStackedXValue(dataItem, key) {
        const stackToItem = dataItem.get("stackToItemX");
        if (stackToItem) {
            return stackToItem.get(key, 0) + this.getStackedXValue(stackToItem, key);
        }
        return 0;
    }
    /**
     * @ignore
     */
    createLegendMarker(_dataItem) {
        this.updateLegendMarker();
    }
    _markDirtyAxes() {
        this._axesDirty = true;
        this.markDirty();
    }
    _markDataSetDirty() {
        this._afterDataChange();
        this._valuesDirty = true;
        this._dataProcessed = false;
        this._aggregatesCalculated = false;
        this.markDirty();
    }
    _clearDirty() {
        super._clearDirty();
        this._axesDirty = false;
        this._selectionProcessed = false;
        this._stackDirty = false;
        this._dataProcessed = false;
    }
    _positionBullet(bullet) {
        let sprite = bullet.get("sprite");
        if (sprite) {
            let dataItem = sprite.dataItem;
            let locationX = bullet.get("locationX", dataItem.get("locationX", 0.5));
            let locationY = bullet.get("locationY", dataItem.get("locationY", 0.5));
            let xAxis = this.get("xAxis");
            let yAxis = this.get("yAxis");
            let positionX = xAxis.getDataItemPositionX(dataItem, this._xField, locationX, this.get("vcx", 1));
            let positionY = yAxis.getDataItemPositionY(dataItem, this._yField, locationY, this.get("vcy", 1));
            let point = this.getPoint(positionX, positionY);
            let left = dataItem.get("left", point.x);
            let right = dataItem.get("right", point.x);
            let top = dataItem.get("top", point.y);
            let bottom = dataItem.get("bottom", point.y);
            let x = 0;
            let y = 0;
            let w = right - left;
            let h = bottom - top;
            if (this._shouldShowBullet(positionX, positionY)) {
                sprite.setPrivate("visible", !bullet.getPrivate("hidden"));
                let field = bullet.get("field");
                const baseAxis = this.get("baseAxis");
                const xAxis = this.get("xAxis");
                const yAxis = this.get("yAxis");
                if (field != undefined) {
                    let realField;
                    if (baseAxis == xAxis) {
                        if (field == "value") {
                            realField = this._yField;
                        }
                        else if (field == "open") {
                            realField = this._yOpenField;
                        }
                        else if (field == "high") {
                            realField = this._yHighField;
                        }
                        else if (field == "low") {
                            realField = this._yLowField;
                        }
                        if (realField) {
                            positionY = yAxis.getDataItemPositionY(dataItem, realField, 0, this.get("vcy", 1));
                            point = yAxis.get("renderer").positionToPoint(positionY);
                            y = point.y;
                            x = left + w * locationX;
                        }
                    }
                    else {
                        if (field == "value") {
                            realField = this._xField;
                        }
                        else if (field == "open") {
                            realField = this._xOpenField;
                        }
                        else if (field == "high") {
                            realField = this._xHighField;
                        }
                        else if (field == "low") {
                            realField = this._xLowField;
                        }
                        if (realField) {
                            positionX = xAxis.getDataItemPositionX(dataItem, realField, 0, this.get("vcx", 1));
                            point = xAxis.get("renderer").positionToPoint(positionX);
                            x = point.x;
                            y = bottom - h * locationY;
                        }
                    }
                }
                else {
                    x = left + w * locationX;
                    y = bottom - h * locationY;
                }
                const stacked = bullet.get("stacked");
                if (stacked) {
                    const chart = this.chart;
                    if (baseAxis == xAxis) {
                        let previousBullet = this._bullets[positionX + "_" + positionY];
                        if (previousBullet) {
                            let previousBounds = previousBullet.bounds();
                            let bounds = sprite.localBounds();
                            let yo = y;
                            y = previousBounds.top;
                            if (stacked == "down") {
                                y = previousBounds.bottom - bounds.top;
                            }
                            else if (stacked == "auto") {
                                if (chart) {
                                    if (yo < chart.plotContainer.height() / 2) {
                                        y = previousBounds.bottom - bounds.top;
                                    }
                                    else {
                                        y += bounds.bottom;
                                    }
                                }
                            }
                            else {
                                y += bounds.bottom;
                            }
                        }
                        this._bullets[positionX + "_" + positionY] = sprite;
                    }
                    else {
                        let previousBullet = this._bullets[positionX + "_" + positionY];
                        if (previousBullet) {
                            let previousBounds = previousBullet.bounds();
                            let bounds = sprite.localBounds();
                            let xo = x;
                            x = previousBounds.right;
                            if (stacked == "down") {
                                x = previousBounds.left - bounds.right;
                            }
                            else if (stacked == "auto") {
                                if (chart) {
                                    if (xo < chart.plotContainer.width() / 2) {
                                        x = previousBounds.left - bounds.right;
                                    }
                                    else {
                                        x -= bounds.left;
                                    }
                                }
                            }
                            else {
                                x -= bounds.left;
                            }
                        }
                        this._bullets[positionX + "_" + positionY] = sprite;
                    }
                }
                if (sprite.isType("Label")) {
                    sprite.setPrivate("maxWidth", Math.abs(w));
                    sprite.setPrivate("maxHeight", Math.abs(h));
                }
                sprite.setAll({ x, y });
            }
            else {
                sprite.setPrivate("visible", false);
            }
        }
    }
    _shouldShowBullet(_positionX, _positionY) {
        return this._showBullets;
    }
    /**
     * @ignore
     */
    setDataSet(id) {
        if (this._dataSets[id]) {
            this._handleDataSetChange();
            this._dataItems = this._dataSets[id];
            this._markDataSetDirty();
            this._dataSetId = id;
            const type = "datasetchanged";
            if (this.events.isEnabled(type)) {
                this.events.dispatch(type, { type: type, target: this, id: id });
            }
        }
    }
    /**
     * @ignore
     */
    resetGrouping() {
        $object.each(this._dataSets, (_key, dataSet) => {
            if (dataSet != this._mainDataItems) {
                $array.each(dataSet, (dataItem) => {
                    this.disposeDataItem(dataItem);
                });
            }
        });
        this._dataSets = {};
        this._dataItems = this.mainDataItems;
    }
    _handleDataSetChange() {
        $array.each(this._dataItems, (dataItem) => {
            let bullets = dataItem.bullets;
            if (bullets) {
                $array.each(bullets, (bullet) => {
                    if (bullet) {
                        let sprite = bullet.get("sprite");
                        if (sprite) {
                            sprite.setPrivate("visible", false);
                        }
                    }
                });
            }
        });
        this._selectionProcessed = false; // for totals to be calculated
    }
    /**
     * Shows hidden series.
     *
     * @param   duration  Duration of animation in milliseconds
     * @return            Animation promise
     */
    show(duration) {
        const _super = Object.create(null, {
            show: { get: () => super.show }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this._fixVC();
            let promises = [];
            promises.push(_super.show.call(this, duration).then(() => {
                this._isShowing = false;
                let xAxis = this.get("xAxis");
                let yAxis = this.get("yAxis");
                let baseAxis = this.get("baseAxis");
                if (yAxis !== baseAxis) {
                    yAxis.markDirtySelectionExtremes();
                }
                if (xAxis !== baseAxis) {
                    xAxis.markDirtySelectionExtremes();
                }
            }));
            promises.push(this.bulletsContainer.show(duration));
            promises.push(this._sequencedShowHide(true, duration));
            yield Promise.all(promises);
        });
    }
    /**
     * Hides series.
     *
     * @param   duration  Duration of animation in milliseconds
     * @return            Animation promise
     */
    hide(duration) {
        const _super = Object.create(null, {
            hide: { get: () => super.hide }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this._fixVC();
            let promises = [];
            promises.push(_super.hide.call(this, duration).then(() => {
                this._isHiding = false;
            }));
            promises.push(this.bulletsContainer.hide(duration));
            promises.push(this._sequencedShowHide(false, duration));
            yield Promise.all(promises);
        });
    }
    /**
     * Shows series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    showDataItem(dataItem, duration) {
        const _super = Object.create(null, {
            showDataItem: { get: () => super.showDataItem }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [_super.showDataItem.call(this, dataItem, duration)];
            if (!$type.isNumber(duration)) {
                duration = this.get("stateAnimationDuration", 0);
            }
            const easing = this.get("stateAnimationEasing");
            $array.each(this._valueFields, (key) => {
                promises.push(dataItem.animate({ key: key + "Working", to: dataItem.get(key), duration: duration, easing: easing }).waitForStop());
            });
            yield Promise.all(promises);
        });
    }
    /**
     * Hides series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    hideDataItem(dataItem, duration) {
        const _super = Object.create(null, {
            hideDataItem: { get: () => super.hideDataItem }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [_super.hideDataItem.call(this, dataItem, duration)];
            const hiddenState = this.states.create("hidden", {});
            if (!$type.isNumber(duration)) {
                duration = hiddenState.get("stateAnimationDuration", this.get("stateAnimationDuration", 0));
            }
            const easing = hiddenState.get("stateAnimationEasing", this.get("stateAnimationEasing"));
            const xAxis = this.get("xAxis");
            const yAxis = this.get("yAxis");
            const baseAxis = this.get("baseAxis");
            const stacked = this.get("stacked");
            if (baseAxis === xAxis || !baseAxis) {
                $array.each(this._valueYFields, (key) => {
                    let min = yAxis.getPrivate("min");
                    let baseValue = yAxis.baseValue();
                    if ($type.isNumber(min) && min > baseValue) {
                        baseValue = min;
                    }
                    if (stacked) {
                        baseValue = 0;
                    }
                    let value = dataItem.get(key);
                    if (value != null) {
                        promises.push(dataItem.animate({ key: key + "Working", to: baseValue, duration: duration, easing: easing }).waitForStop());
                    }
                });
            }
            if (baseAxis === yAxis || !baseAxis) {
                let min = xAxis.getPrivate("min");
                let baseValue = xAxis.baseValue();
                if ($type.isNumber(min) && min > baseValue) {
                    baseValue = min;
                }
                if (stacked) {
                    baseValue = 0;
                }
                $array.each(this._valueXFields, (key) => {
                    let value = dataItem.get(key);
                    if (value != null) {
                        promises.push(dataItem.animate({ key: key + "Working", to: baseValue, duration: duration, easing: easing }).waitForStop());
                    }
                });
            }
            yield Promise.all(promises);
        });
    }
    _markDirtyStack() {
        this._stackDirty = true;
        this.markDirty();
        this._markStakedDirtyStack();
    }
    _markStakedDirtyStack() {
        const stackedSeries = this._stackedSeries;
        if (stackedSeries) {
            $object.each(stackedSeries, (_key, value) => {
                if (!value._stackDirty) {
                    value._markDirtyStack();
                }
            });
        }
    }
    _afterChanged() {
        super._afterChanged();
        if (this._skipped) {
            this._markDirtyAxes();
            this._skipped = false;
        }
    }
    /**
     * Shows a tooltip for specific data item.
     *
     * @param  dataItem  Data item
     */
    showDataItemTooltip(dataItem) {
        this.updateLegendMarker(dataItem);
        this.updateLegendValue(dataItem);
        const tooltip = this.get("tooltip");
        if (tooltip) {
            if (!this.isHidden()) {
                tooltip._setDataItem(dataItem);
                if (dataItem) {
                    let locationX = this.get("locationX", 0);
                    let locationY = this.get("locationY", 1);
                    let itemLocationX = dataItem.get("locationX", locationX);
                    let itemLocationY = dataItem.get("locationY", locationY);
                    const xAxis = this.get("xAxis");
                    const yAxis = this.get("yAxis");
                    const vcx = this.get("vcx", 1);
                    const vcy = this.get("vcy", 1);
                    const xPos = xAxis.getDataItemPositionX(dataItem, this._tooltipFieldX, this._aLocationX0 + (this._aLocationX1 - this._aLocationX0) * itemLocationX, vcx);
                    const yPos = yAxis.getDataItemPositionY(dataItem, this._tooltipFieldY, this._aLocationY0 + (this._aLocationY1 - this._aLocationY0) * itemLocationY, vcy);
                    const point = this.getPoint(xPos, yPos);
                    let show = true;
                    $array.each(this._valueFields, (field) => {
                        if (dataItem.get(field) == null) {
                            show = false;
                        }
                    });
                    if (show) {
                        const chart = this.chart;
                        if (chart && chart.inPlot(point)) {
                            tooltip.label.text.markDirtyText();
                            tooltip.set("tooltipTarget", this._getTooltipTarget(dataItem));
                            tooltip.set("pointTo", this._display.toGlobal({ x: point.x, y: point.y }));
                        }
                        else {
                            tooltip._setDataItem(undefined);
                        }
                    }
                    else {
                        tooltip._setDataItem(undefined);
                    }
                }
            }
            else {
                this.hideTooltip();
            }
        }
    }
    hideTooltip() {
        const tooltip = this.get("tooltip");
        if (tooltip) {
            tooltip.set("tooltipTarget", this);
        }
        return super.hideTooltip();
    }
    _getTooltipTarget(dataItem) {
        if (this.get("seriesTooltipTarget") == "bullet") {
            const bullets = dataItem.bullets;
            if (bullets && bullets.length > 0) {
                const bullet = bullets[0];
                const sprite = bullet.get("sprite");
                if (sprite) {
                    return sprite;
                }
            }
        }
        return this;
    }
    /**
     * @ignore
     */
    updateLegendValue(dataItem) {
        const legendDataItem = this.get("legendDataItem");
        if (legendDataItem) {
            const label = legendDataItem.get("label");
            if (label) {
                let txt = "";
                if (dataItem) {
                    label._setDataItem(dataItem);
                    txt = this.get("legendLabelText", label.get("text", this.get("name", "")));
                }
                else {
                    label._setDataItem(this._emptyDataItem);
                    txt = this.get("legendRangeLabelText", this.get("legendLabelText", label.get("text", this.get("name", ""))));
                }
                label.set("text", txt);
            }
            const valueLabel = legendDataItem.get("valueLabel");
            if (valueLabel) {
                let txt = "";
                if (dataItem) {
                    valueLabel._setDataItem(dataItem);
                    txt = this.get("legendValueText", valueLabel.get("text", ""));
                }
                else {
                    valueLabel._setDataItem(this._emptyDataItem);
                    txt = this.get("legendRangeValueText", valueLabel.get("text", ""));
                }
                valueLabel.set("text", txt);
            }
        }
    }
    _getItemReaderLabel() {
        let text = "X: {" + this._xField;
        if (this.get("xAxis").isType("DateAxis")) {
            text += ".formatDate()";
        }
        text += "}; Y: {" + this._yField;
        if (this.get("yAxis").isType("DateAxis")) {
            text += ".formatDate()";
        }
        text += "}";
        return text;
    }
    /**
     * @ignore
     */
    getPoint(positionX, positionY) {
        let x = this.get("xAxis").get("renderer").positionToCoordinate(positionX);
        let y = this.get("yAxis").get("renderer").positionToCoordinate(positionY);
        // if coordinate is super big, canvas fails to draw line, capping to some big number (won't make any visual difference)
        let max = 999999999;
        if (y < -max) {
            y = -max;
        }
        if (y > max) {
            y = max;
        }
        if (x < -max) {
            x = -max;
        }
        if (x > max) {
            x = max;
        }
        return { x: x, y: y };
    }
    _shouldInclude(_position) {
        return true;
    }
    /**
     * @ignore
     */
    handleCursorHide() {
        this.hideTooltip();
        this.updateLegendValue(undefined);
        this.updateLegendMarker(undefined);
    }
    _afterDataChange() {
        super._afterDataChange();
        this.get("xAxis")._markDirtyKey("start");
        this.get("yAxis")._markDirtyKey("start");
        this.resetExtremes();
    }
    /**
     * Resets cached axis scale values.
     */
    resetExtremes() {
        this.setPrivate("selectionMinX", undefined);
        this.setPrivate("selectionMaxX", undefined);
        this.setPrivate("selectionMinY", undefined);
        this.setPrivate("selectionMaxY", undefined);
        this.setPrivate("minX", undefined);
        this.setPrivate("minY", undefined);
        this.setPrivate("maxX", undefined);
        this.setPrivate("maxY", undefined);
    }
    /**
     * Creates and returns an axis range object.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/} for more info
     * @param   axisDataItem  Axis data item
     * @return                Axis range
     */
    createAxisRange(axisDataItem) {
        return this.axisRanges.push({
            axisDataItem: axisDataItem
        });
    }
    /**
     * A list of series's main (ungrouped) data items.
     *
     * @return  Data items
     */
    get mainDataItems() {
        return this._mainDataItems;
    }
}
Object.defineProperty(XYSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "XYSeries"
});
Object.defineProperty(XYSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Series.classNames.concat([XYSeries.className])
});
//# sourceMappingURL=XYSeries.js.map
import { __awaiter } from "tslib";
import { Series } from "../../core/render/Series";
import { Container } from "../../core/render/Container";
import { visualSettings } from "../../core/render/Graphics";
import * as $array from "../../core/util/Array";
import * as $type from "../../core/util/Type";
/**
 * A base class for any percent chart series.
 */
export class PercentSeries extends Series {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "slicesContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, { position: "absolute", isMeasured: false }))
        });
        Object.defineProperty(this, "labelsContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, { position: "absolute", isMeasured: false }))
        });
        Object.defineProperty(this, "ticksContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, { position: "absolute", isMeasured: false }))
        });
        Object.defineProperty(this, "_lLabels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_rLabels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_hLabels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        /**
         * A [[ListTemplate]] of all slices in series.
         *
         * `slices.template` can also be used to configure slices.
         */
        Object.defineProperty(this, "slices", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._makeSlices()
        });
        /**
         * A [[ListTemplate]] of all slice labels in series.
         *
         * `labels.template` can also be used to configure slice labels.
         */
        Object.defineProperty(this, "labels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._makeLabels()
        });
        /**
         * A [[ListTemplate]] of all slice ticks in series.
         *
         * `ticks.template` can also be used to configure slice ticks.
         */
        Object.defineProperty(this, "ticks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._makeTicks()
        });
    }
    /**
     * @ignore
     */
    makeSlice(dataItem) {
        const slice = this.slicesContainer.children.push(this.slices.make());
        slice.on("fill", () => {
            this.updateLegendMarker(dataItem);
        });
        slice.on("stroke", () => {
            this.updateLegendMarker(dataItem);
        });
        slice._setDataItem(dataItem);
        dataItem.set("slice", slice);
        this.slices.push(slice);
        return slice;
    }
    /**
     * @ignore
     */
    makeLabel(dataItem) {
        const label = this.labelsContainer.children.push(this.labels.make());
        label._setDataItem(dataItem);
        dataItem.set("label", label);
        this.labels.push(label);
        return label;
    }
    _shouldMakeBullet(dataItem) {
        if (dataItem.get("value") != null) {
            return true;
        }
        return false;
    }
    /**
     * @ignore
     */
    makeTick(dataItem) {
        const tick = this.ticksContainer.children.push(this.ticks.make());
        tick._setDataItem(dataItem);
        dataItem.set("tick", tick);
        this.ticks.push(tick);
        return tick;
    }
    _afterNew() {
        this.fields.push("category", "fill");
        super._afterNew();
    }
    _onDataClear() {
        const colors = this.get("colors");
        if (colors) {
            colors.reset();
        }
    }
    _prepareChildren() {
        super._prepareChildren();
        this._lLabels = [];
        this._rLabels = [];
        this._hLabels = [];
        if (this._valuesDirty) {
            let sum = 0;
            let absSum = 0;
            let valueHigh = 0;
            let valueLow = Infinity;
            let count = 0;
            $array.each(this._dataItems, (dataItem) => {
                let valueWorking = dataItem.get("valueWorking", 0);
                sum += valueWorking;
                absSum += Math.abs(valueWorking);
            });
            $array.each(this._dataItems, (dataItem) => {
                let value = dataItem.get("valueWorking", 0);
                if (value > valueHigh) {
                    valueHigh = value;
                }
                if (value < valueLow) {
                    valueLow = value;
                }
                count++;
                let percentTotal = value / absSum;
                if (absSum == 0) {
                    percentTotal = 0;
                }
                dataItem.setRaw("valuePercentTotal", percentTotal * 100);
            });
            this.setPrivateRaw("valueLow", valueLow);
            this.setPrivateRaw("valueHigh", valueHigh);
            this.setPrivateRaw("valueSum", sum);
            this.setPrivateRaw("valueAverage", sum / count);
            this.setPrivateRaw("valueAbsoluteSum", absSum);
        }
    }
    /**
     * Shows hidden series.
     *
     * @param   duration  Animation duration in milliseconds
     * @return            Animation promise
     */
    show(duration) {
        const _super = Object.create(null, {
            show: { get: () => super.show }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let promises = [];
            promises.push(_super.show.call(this, duration));
            promises.push(this._sequencedShowHide(true, duration));
            yield Promise.all(promises);
        });
    }
    /**
     * Hide whole series.
     *
     * @param   duration  Animation duration in milliseconds
     * @return            Animation promise
     */
    hide(duration) {
        const _super = Object.create(null, {
            hide: { get: () => super.hide }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let promises = [];
            promises.push(_super.hide.call(this, duration));
            promises.push(this._sequencedShowHide(false, duration));
            yield Promise.all(promises);
        });
    }
    /**
     * @ignore
     */
    _updateChildren() {
        super._updateChildren();
        if (this._valuesDirty) {
            $array.each(this._dataItems, (dataItem) => {
                dataItem.get("label").text.markDirtyText();
            });
        }
        if (this.isDirty("legendLabelText") || this.isDirty("legendValueText")) {
            $array.each(this._dataItems, (dataItem) => {
                this.updateLegendValue(dataItem);
            });
        }
        this._arrange();
    }
    _arrange() {
        this._arrangeDown(this._lLabels);
        this._arrangeUp(this._lLabels);
        this._arrangeDown(this._rLabels);
        this._arrangeUp(this._rLabels);
        this._arrangeLeft(this._hLabels);
        this._arrangeRight(this._hLabels);
        $array.each(this.dataItems, (dataItem) => {
            this._updateTick(dataItem);
        });
    }
    _afterChanged() {
        super._afterChanged();
        this._arrange();
    }
    processDataItem(dataItem) {
        super.processDataItem(dataItem);
        if (dataItem.get("fill") == null) {
            let colors = this.get("colors");
            if (colors) {
                dataItem.setRaw("fill", colors.next());
            }
        }
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
            let value = dataItem.get("value");
            const animation = dataItem.animate({ key: "valueWorking", to: value, duration: duration, easing: easing });
            if (animation) {
                promises.push(animation.waitForStop());
            }
            const tick = dataItem.get("tick");
            if (tick) {
                promises.push(tick.show(duration));
            }
            const label = dataItem.get("label");
            if (label) {
                promises.push(label.show(duration));
            }
            const slice = dataItem.get("slice");
            if (slice) {
                promises.push(slice.show(duration));
            }
            if (slice.get("active")) {
                slice.states.applyAnimate("active");
            }
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
            const animation = dataItem.animate({ key: "valueWorking", to: 0, duration: duration, easing: easing });
            if (animation) {
                promises.push(animation.waitForStop());
            }
            const tick = dataItem.get("tick");
            if (tick) {
                promises.push(tick.hide(duration));
            }
            const label = dataItem.get("label");
            if (label) {
                promises.push(label.hide(duration));
            }
            const slice = dataItem.get("slice");
            slice.hideTooltip();
            if (slice) {
                promises.push(slice.hide(duration));
            }
            yield Promise.all(promises);
        });
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        let label = dataItem.get("label");
        if (label) {
            this.labels.removeValue(label);
            label.dispose();
        }
        let tick = dataItem.get("tick");
        if (tick) {
            this.ticks.removeValue(tick);
            tick.dispose();
        }
        let slice = dataItem.get("slice");
        if (slice) {
            this.slices.removeValue(slice);
            slice.dispose();
        }
    }
    /**
     * Triggers hover on a series data item.
     *
     * @since 5.0.7
     * @param  dataItem  Target data item
     */
    hoverDataItem(dataItem) {
        const slice = dataItem.get("slice");
        if (slice && !slice.isHidden()) {
            slice.hover();
        }
    }
    /**
     * Triggers un-hover on a series data item.
     *
     * @since 5.0.7
     * @param  dataItem  Target data item
     */
    unhoverDataItem(dataItem) {
        const slice = dataItem.get("slice");
        if (slice) {
            slice.unhover();
        }
    }
    /**
     * @ignore
     */
    updateLegendMarker(dataItem) {
        if (dataItem) {
            const slice = dataItem.get("slice");
            if (slice) {
                const legendDataItem = dataItem.get("legendDataItem");
                if (legendDataItem) {
                    const markerRectangle = legendDataItem.get("markerRectangle");
                    $array.each(visualSettings, (setting) => {
                        if (slice.get(setting) != null) {
                            markerRectangle.set(setting, slice.get(setting));
                        }
                    });
                }
            }
        }
    }
    _arrangeDown(labels) {
        if (labels) {
            let next = this._getNextDown();
            labels.sort((a, b) => {
                if (a.y > b.y) {
                    return 1;
                }
                else if (a.y < b.y) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            $array.each(labels, (l) => {
                const bounds = l.label.adjustedLocalBounds();
                let labelTop = bounds.top;
                if (l.y + labelTop < next) {
                    l.y = next - labelTop;
                }
                l.label.set("y", l.y);
                next = l.y + bounds.bottom;
            });
        }
    }
    _getNextUp() {
        return this.labelsContainer.maxHeight();
    }
    _getNextDown() {
        return 0;
    }
    _arrangeUp(labels) {
        if (labels) {
            let next = this._getNextUp();
            labels.sort((a, b) => {
                if (a.y < b.y) {
                    return 1;
                }
                else if (a.y > b.y) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            $array.each(labels, (l) => {
                const bounds = l.label.adjustedLocalBounds();
                let labelBottom = bounds.bottom;
                if (l.y + labelBottom > next) {
                    l.y = next - labelBottom;
                }
                l.label.set("y", l.y);
                next = l.y + bounds.top;
            });
        }
    }
    _arrangeRight(labels) {
        if (labels) {
            let next = 0;
            labels.sort((a, b) => {
                if (a.y > b.y) {
                    return 1;
                }
                else if (a.y < b.y) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            $array.each(labels, (l) => {
                const bounds = l.label.adjustedLocalBounds();
                let labelLeft = bounds.left;
                if (l.y + labelLeft < next) {
                    l.y = next - labelLeft;
                }
                l.label.set("x", l.y);
                next = l.y + bounds.right;
            });
        }
    }
    _arrangeLeft(labels) {
        if (labels) {
            let next = this.labelsContainer.maxWidth();
            labels.sort((a, b) => {
                if (a.y < b.y) {
                    return 1;
                }
                else if (a.y > b.y) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            $array.each(labels, (l) => {
                const bounds = l.label.adjustedLocalBounds();
                let labelRight = bounds.right;
                if (l.y + labelRight > next) {
                    l.y = next - labelRight;
                }
                l.label.set("x", l.y);
                next = l.y + bounds.left;
            });
        }
    }
    _updateSize() {
        super._updateSize();
        this.markDirty();
    }
    _updateTick(_dataItem) {
    }
    _dispose() {
        super._dispose();
        const chart = this.chart;
        if (chart) {
            chart.series.removeValue(this);
        }
    }
}
Object.defineProperty(PercentSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "PercentSeries"
});
Object.defineProperty(PercentSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Series.classNames.concat([PercentSeries.className])
});
//# sourceMappingURL=PercentSeries.js.map
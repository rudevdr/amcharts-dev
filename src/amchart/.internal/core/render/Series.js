import { __awaiter } from "tslib";
import { Component } from "../../core/render/Component";
import { List } from "../../core/util/List";
import { Color } from "../../core/util/Color";
import { percentInterpolate } from "../../core/util/Animation";
import { Percent } from "../../core/util/Percent";
import * as $array from "../../core/util/Array";
import * as $type from "../../core/util/Type";
import * as $time from "../../core/util/Time";
import { p100 } from "../../core/util/Percent";
import { Container } from "../../core/render/Container";
import { Label } from "../../core/render/Label";
/**
 * A base class for all series.
 */
export class Series extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_aggregatesCalculated", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_selectionAggregatesCalculated", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_dataProcessed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_psi", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_pei", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * A chart series belongs to.
         */
        Object.defineProperty(this, "chart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * List of bullets to use for the series.
         *
         * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/bullets/} for more info
         */
        Object.defineProperty(this, "bullets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new List()
        });
        /**
         * A [[Container]] series' bullets are stored in.
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "bulletsContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Container.new(this._root, { width: p100, height: p100, position: "absolute" })
        });
    }
    _afterNew() {
        this.valueFields.push("value", "customValue");
        super._afterNew();
        this.setPrivate("customData", {});
        this._disposers.push(this.bullets.events.onAll((change) => {
            if (change.type === "clear") {
                this._handleBullets(this.dataItems);
            }
            else if (change.type === "push") {
                this._handleBullets(this.dataItems);
            }
            else if (change.type === "setIndex") {
                this._handleBullets(this.dataItems);
            }
            else if (change.type === "insertIndex") {
                this._handleBullets(this.dataItems);
            }
            else if (change.type === "removeIndex") {
                this._handleBullets(this.dataItems);
            }
            else if (change.type === "moveIndex") {
                this._handleBullets(this.dataItems);
            }
            else {
                throw new Error("Unknown IListEvent type");
            }
        }));
    }
    _dispose() {
        this.bulletsContainer.dispose(); // can be in a different parent
        super._dispose();
    }
    startIndex() {
        let len = this.dataItems.length;
        return Math.min(this.getPrivate("startIndex", 0), len);
    }
    endIndex() {
        let len = this.dataItems.length;
        return Math.min(this.getPrivate("endIndex", len), len);
    }
    _handleBullets(dataItems) {
        $array.each(dataItems, (dataItem) => {
            const bullets = dataItem.bullets;
            if (bullets) {
                $array.each(bullets, (bullet) => {
                    bullet.dispose();
                });
                dataItem.bullets = undefined;
            }
        });
        this.markDirtyValues();
    }
    /**
     * Looks up and returns a data item by its ID.
     *
     * @param   id  ID
     * @return      Data item
     */
    getDataItemById(id) {
        return $array.find(this.dataItems, (dataItem) => {
            return dataItem.get("id") == id;
        });
    }
    _makeBullets(dataItem) {
        if (this._shouldMakeBullet(dataItem)) {
            dataItem.bullets = [];
            this.bullets.each((bulletFunction) => {
                this._makeBullet(dataItem, bulletFunction);
            });
        }
    }
    _shouldMakeBullet(_dataItem) {
        return true;
    }
    _makeBullet(dataItem, bulletFunction, index) {
        const bullet = bulletFunction(this._root, this, dataItem);
        if (bullet) {
            bullet._index = index;
            this._makeBulletReal(dataItem, bullet);
        }
        return bullet;
    }
    _makeBulletReal(dataItem, bullet) {
        let sprite = bullet.get("sprite");
        if (sprite) {
            sprite._setDataItem(dataItem);
            sprite.setRaw("position", "absolute");
            this.bulletsContainer.children.push(sprite);
        }
        bullet.series = this;
        dataItem.bullets.push(bullet);
    }
    /**
     * Adds bullet directly to a data item.
     *
     * Please note: method accepts [[Bullet]] instance as a paramter, not a
     * reference to a function.
     *
     * You should add Bullet instance, not a method like you do it on series.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/bullets/#Adding_directly_to_data_item} for more info
     * @since 5.6.0
     *
     * @param  dataItem  Target data item
     * @param  bullet    Bullet instance
     */
    addBullet(dataItem, bullet) {
        if (!dataItem.bullets) {
            dataItem.bullets = [];
        }
        if (bullet) {
            this._makeBulletReal(dataItem, bullet);
        }
    }
    _clearDirty() {
        super._clearDirty();
        this._aggregatesCalculated = false;
        this._selectionAggregatesCalculated = false;
    }
    _prepareChildren() {
        super._prepareChildren();
        let startIndex = this.startIndex();
        let endIndex = this.endIndex();
        if (this.isDirty("name")) {
            this.updateLegendValue();
        }
        if (this.isDirty("heatRules")) {
            this._valuesDirty = true;
        }
        if (this.isPrivateDirty("baseValueSeries")) {
            const baseValueSeries = this.getPrivate("baseValueSeries");
            if (baseValueSeries) {
                this._disposers.push(baseValueSeries.onPrivate("startIndex", () => {
                    this.markDirtyValues();
                }));
            }
        }
        const calculateAggregates = this.get("calculateAggregates");
        if (calculateAggregates) {
            if (this._valuesDirty && !this._dataProcessed) {
                if (!this._aggregatesCalculated) {
                    this._calculateAggregates(0, this.dataItems.length);
                    this._aggregatesCalculated = true;
                }
            }
            if ((this._psi != startIndex || this._pei != endIndex) && !this._selectionAggregatesCalculated) {
                if (startIndex === 0 && endIndex === this.dataItems.length && this._aggregatesCalculated) {
                    // void
                }
                else {
                    this._calculateAggregates(startIndex, endIndex);
                }
                this._selectionAggregatesCalculated = true;
            }
        }
        if (this.isDirty("tooltip")) {
            let tooltip = this.get("tooltip");
            if (tooltip) {
                tooltip.hide(0);
                tooltip.set("tooltipTarget", this);
            }
        }
        if (this.isDirty("fill") || this.isDirty("stroke")) {
            let markerRectangle;
            const legendDataItem = this.get("legendDataItem");
            if (legendDataItem) {
                markerRectangle = legendDataItem.get("markerRectangle");
                if (markerRectangle) {
                    if (this.isVisible()) {
                        if (this.isDirty("stroke")) {
                            let stroke = this.get("stroke");
                            markerRectangle.set("stroke", stroke);
                        }
                        if (this.isDirty("fill")) {
                            let fill = this.get("fill");
                            markerRectangle.set("fill", fill);
                        }
                    }
                }
            }
            this.updateLegendMarker(undefined);
        }
        if (this.bullets.length > 0) {
            let startIndex = this.startIndex();
            let endIndex = this.endIndex();
            if (endIndex < this.dataItems.length) {
                endIndex++;
            }
            for (let i = startIndex; i < endIndex; i++) {
                let dataItem = this.dataItems[i];
                if (!dataItem.bullets) {
                    this._makeBullets(dataItem);
                }
            }
        }
    }
    _calculateAggregates(startIndex, endIndex) {
        let fields = this._valueFields;
        if (!fields) {
            throw new Error("No value fields are set for the series.");
        }
        const sum = {};
        const absSum = {};
        const count = {};
        const low = {};
        const high = {};
        const open = {};
        const close = {};
        const average = {};
        const previous = {};
        $array.each(fields, (key) => {
            sum[key] = 0;
            absSum[key] = 0;
            count[key] = 0;
        });
        $array.each(fields, (key) => {
            let change = key + "Change";
            let changePercent = key + "ChangePercent";
            let changePrevious = key + "ChangePrevious";
            let changePreviousPercent = key + "ChangePreviousPercent";
            let changeSelection = key + "ChangeSelection";
            let changeSelectionPercent = key + "ChangeSelectionPercent";
            let openKey = "valueY";
            if (key == "valueX" || key == "openValueX" || key == "lowValueX" || key == "highValueX") {
                openKey = "valueX";
            }
            const baseValueSeries = this.getPrivate("baseValueSeries");
            for (let i = startIndex; i < endIndex; i++) {
                const dataItem = this.dataItems[i];
                let value = dataItem.get(key);
                if (value != null) {
                    count[key]++;
                    sum[key] += value;
                    absSum[key] += Math.abs(value);
                    average[key] = sum[key] / count[key];
                    if (low[key] > value || low[key] == null) {
                        low[key] = value;
                    }
                    if (high[key] < value || high[key] == null) {
                        high[key] = value;
                    }
                    close[key] = value;
                    if (open[key] == null) {
                        open[key] = value;
                        previous[key] = value;
                        if (baseValueSeries) {
                            open[openKey] = baseValueSeries._getBase(openKey);
                        }
                    }
                    if (startIndex === 0) {
                        dataItem.setRaw((change), value - open[openKey]);
                        dataItem.setRaw((changePercent), (value - open[openKey]) / open[openKey] * 100);
                    }
                    dataItem.setRaw((changePrevious), value - previous[openKey]);
                    dataItem.setRaw((changePreviousPercent), (value - previous[openKey]) / previous[openKey] * 100);
                    dataItem.setRaw((changeSelection), value - open[openKey]);
                    dataItem.setRaw((changeSelectionPercent), (value - open[openKey]) / open[openKey] * 100);
                    previous[key] = value;
                }
            }
        });
        $array.each(fields, (key) => {
            this.setPrivate((key + "AverageSelection"), average[key]);
            this.setPrivate((key + "CountSelection"), count[key]);
            this.setPrivate((key + "SumSelection"), sum[key]);
            this.setPrivate((key + "AbsoluteSumSelection"), absSum[key]);
            this.setPrivate((key + "LowSelection"), low[key]);
            this.setPrivate((key + "HighSelection"), high[key]);
            this.setPrivate((key + "OpenSelection"), open[key]);
            this.setPrivate((key + "CloseSelection"), close[key]);
        });
        if (startIndex === 0 && endIndex === this.dataItems.length) {
            $array.each(fields, (key) => {
                this.setPrivate((key + "Average"), average[key]);
                this.setPrivate((key + "Count"), count[key]);
                this.setPrivate((key + "Sum"), sum[key]);
                this.setPrivate((key + "AbsoluteSum"), absSum[key]);
                this.setPrivate((key + "Low"), low[key]);
                this.setPrivate((key + "High"), high[key]);
                this.setPrivate((key + "Open"), open[key]);
                this.setPrivate((key + "Close"), close[key]);
            });
        }
    }
    _updateChildren() {
        super._updateChildren();
        this._psi = this.startIndex();
        this._pei = this.endIndex();
        if (this.isDirty("visible")) {
            this.bulletsContainer.set("visible", this.get("visible"));
        }
        // Apply heat rules
        const rules = this.get("heatRules");
        if (this._valuesDirty && rules && rules.length > 0) {
            $array.each(rules, (rule) => {
                const minValue = rule.minValue || this.getPrivate((rule.dataField + "Low")) || 0;
                const maxValue = rule.maxValue || this.getPrivate((rule.dataField + "High")) || 0;
                $array.each(rule.target._entities, (target) => {
                    const value = target.dataItem.get(rule.dataField);
                    if (!$type.isNumber(value)) {
                        if (rule.neutral) {
                            target.set(rule.key, rule.neutral);
                        }
                        return;
                    }
                    if (rule.customFunction) {
                        rule.customFunction.call(this, target, minValue, maxValue, value);
                    }
                    else {
                        let percent;
                        if (rule.logarithmic) {
                            percent = (Math.log(value) * Math.LOG10E - Math.log(minValue) * Math.LOG10E) / ((Math.log(maxValue) * Math.LOG10E - Math.log(minValue) * Math.LOG10E));
                        }
                        else {
                            percent = (value - minValue) / (maxValue - minValue);
                        }
                        if ($type.isNumber(value) && (!$type.isNumber(percent) || Math.abs(percent) == Infinity)) {
                            percent = 0.5;
                        }
                        // fixes problems if all values are the same
                        let propertyValue;
                        if ($type.isNumber(rule.min)) {
                            propertyValue = rule.min + (rule.max - rule.min) * percent;
                        }
                        else if (rule.min instanceof Color) {
                            propertyValue = Color.interpolate(percent, rule.min, rule.max);
                        }
                        else if (rule.min instanceof Percent) {
                            propertyValue = percentInterpolate(percent, rule.min, rule.max);
                        }
                        target.set(rule.key, propertyValue);
                    }
                });
            });
        }
        if (this.get("visible")) {
            //if (this.bullets.length > 0) {
            let count = this.dataItems.length;
            let startIndex = this.startIndex();
            let endIndex = this.endIndex();
            if (endIndex < count) {
                endIndex++;
            }
            if (startIndex > 0) {
                startIndex--;
            }
            for (let i = 0; i < startIndex; i++) {
                this._hideBullets(this.dataItems[i]);
            }
            for (let i = startIndex; i < endIndex; i++) {
                this._positionBullets(this.dataItems[i]);
            }
            for (let i = endIndex; i < count; i++) {
                this._hideBullets(this.dataItems[i]);
            }
            //}
        }
    }
    _positionBullets(dataItem) {
        if (dataItem.bullets) {
            $array.each(dataItem.bullets, (bullet) => {
                this._positionBullet(bullet);
                const sprite = bullet.get("sprite");
                if (bullet.get("dynamic")) {
                    if (sprite) {
                        sprite._markDirtyKey("fill");
                        sprite.markDirtySize();
                    }
                    if (sprite instanceof Container) {
                        sprite.walkChildren((child) => {
                            child._markDirtyKey("fill");
                            child.markDirtySize();
                            if (child instanceof Label) {
                                child.text.markDirtyText();
                            }
                        });
                    }
                }
                if (sprite instanceof Label && sprite.get("populateText")) {
                    sprite.text.markDirtyText();
                }
            });
        }
    }
    _hideBullets(dataItem) {
        if (dataItem.bullets) {
            $array.each(dataItem.bullets, (bullet) => {
                let sprite = bullet.get("sprite");
                if (sprite) {
                    sprite.setPrivate("visible", false);
                }
            });
        }
    }
    _positionBullet(_bullet) {
    }
    _placeBulletsContainer(chart) {
        chart.bulletsContainer.children.moveValue(this.bulletsContainer);
    }
    _removeBulletsContainer() {
        const bulletsContainer = this.bulletsContainer;
        if (bulletsContainer.parent) {
            bulletsContainer.parent.children.removeValue(bulletsContainer);
        }
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        //super.disposeDataItem(dataItem); // does nothing
        const bullets = dataItem.bullets;
        if (bullets) {
            $array.each(bullets, (bullet) => {
                bullet.dispose();
            });
        }
    }
    _getItemReaderLabel() {
        return "";
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
            const bullets = dataItem.bullets;
            if (bullets) {
                $array.each(bullets, (bullet) => {
                    const sprite = bullet.get("sprite");
                    if (sprite) {
                        promises.push(sprite.show(duration));
                    }
                });
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
            const bullets = dataItem.bullets;
            if (bullets) {
                $array.each(bullets, (bullet) => {
                    const sprite = bullet.get("sprite");
                    if (sprite) {
                        promises.push(sprite.hide(duration));
                    }
                });
            }
            yield Promise.all(promises);
        });
    }
    _sequencedShowHide(show, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.get("sequencedInterpolation")) {
                if (!$type.isNumber(duration)) {
                    duration = this.get("interpolationDuration", 0);
                }
                if (duration > 0) {
                    const startIndex = this.startIndex();
                    const endIndex = this.endIndex();
                    yield Promise.all($array.map(this.dataItems, (dataItem, i) => __awaiter(this, void 0, void 0, function* () {
                        let realDuration = duration || 0;
                        if (i < startIndex - 10 || i > endIndex + 10) {
                            realDuration = 0;
                        }
                        //let delay = this.get("sequencedDelay", 0) * i + realDuration * (i - startIndex) / (endIndex - startIndex);
                        let delay = this.get("sequencedDelay", 0) + realDuration / (endIndex - startIndex);
                        yield $time.sleep(delay * (i - startIndex));
                        if (show) {
                            yield this.showDataItem(dataItem, realDuration);
                        }
                        else {
                            yield this.hideDataItem(dataItem, realDuration);
                        }
                    })));
                }
                else {
                    yield Promise.all($array.map(this.dataItems, (dataItem) => {
                        if (show) {
                            return this.showDataItem(dataItem, 0);
                        }
                        else {
                            return this.hideDataItem(dataItem, 0);
                        }
                    }));
                }
            }
        });
    }
    /**
     * @ignore
     */
    updateLegendValue(dataItem) {
        if (dataItem) {
            const legendDataItem = dataItem.get("legendDataItem");
            if (legendDataItem) {
                const valueLabel = legendDataItem.get("valueLabel");
                if (valueLabel) {
                    const text = valueLabel.text;
                    let txt = "";
                    valueLabel._setDataItem(dataItem);
                    txt = this.get("legendValueText", text.get("text", ""));
                    valueLabel.set("text", txt);
                    text.markDirtyText();
                }
                const label = legendDataItem.get("label");
                if (label) {
                    const text = label.text;
                    let txt = "";
                    label._setDataItem(dataItem);
                    txt = this.get("legendLabelText", text.get("text", ""));
                    label.set("text", txt);
                    text.markDirtyText();
                }
            }
        }
    }
    /**
     * @ignore
     */
    updateLegendMarker(_dataItem) {
    }
    _onHide() {
        super._onHide();
        const tooltip = this.getTooltip();
        if (tooltip) {
            tooltip.hide();
        }
    }
    /**
     * @ignore
     */
    hoverDataItem(_dataItem) { }
    /**
     * @ignore
     */
    unhoverDataItem(_dataItem) { }
    /**
     * @ignore
     */
    _getBase(key) {
        const dataItem = this.dataItems[this.startIndex()];
        if (dataItem) {
            return dataItem.get(key);
        }
        return 0;
    }
}
Object.defineProperty(Series, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Series"
});
Object.defineProperty(Series, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Component.classNames.concat([Series.className])
});
//# sourceMappingURL=Series.js.map
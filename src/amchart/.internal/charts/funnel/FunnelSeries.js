import { __awaiter } from "tslib";
import { PercentSeries } from "../percent/PercentSeries";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import { FunnelSlice } from "./FunnelSlice";
import { Tick } from "../../core/render/Tick";
import { Label } from "../../core/render/Label";
import { percent, p50, p100 } from "../../core/util/Percent";
import * as $array from "../../core/util/Array";
import * as $type from "../../core/util/Type";
import * as $utils from "../../core/util/Utils";
/**
 * Creates a funnel series for use in a [[SlicedChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/funnel-series/} for more info
 * @important
 */
export class FunnelSeries extends PercentSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "funnel"
        });
        /**
         * A [[ListTemplate]] of all slice links in series.
         *
         * `links.template` can also be used to configure slice links.
         *
         * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/funnel-series/#Slice_links} for more info
         */
        Object.defineProperty(this, "links", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._makeLinks()
        });
        Object.defineProperty(this, "_total", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_count", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_nextCoord", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_opposite", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    _makeSlices() {
        return new ListTemplate(Template.new({}), () => FunnelSlice._new(this._root, {
            themeTags: $utils.mergeTags(this.slices.template.get("themeTags", []), [this._tag, "series", "slice", this.get("orientation")])
        }, [this.slices.template]));
    }
    _makeLabels() {
        return new ListTemplate(Template.new({}), () => Label._new(this._root, {
            themeTags: $utils.mergeTags(this.labels.template.get("themeTags", []), [this._tag, "series", "label", this.get("orientation")])
        }, [this.labels.template]));
    }
    _makeTicks() {
        return new ListTemplate(Template.new({}), () => Tick._new(this._root, {
            themeTags: $utils.mergeTags(this.ticks.template.get("themeTags", []), [this._tag, "series", "tick", this.get("orientation")])
        }, [this.ticks.template]));
    }
    _makeLinks() {
        return new ListTemplate(Template.new({}), () => FunnelSlice._new(this._root, {
            themeTags: $utils.mergeTags(this.links.template.get("themeTags", []), [this._tag, "series", "link", this.get("orientation")])
        }, [this.links.template]));
    }
    /**
     * @ignore
     */
    makeLink(dataItem) {
        const link = this.slicesContainer.children.push(this.links.make());
        link._setDataItem(dataItem);
        dataItem.set("link", link);
        this.links.push(link);
        return link;
    }
    _afterNew() {
        super._afterNew();
        const slicesContainer = this.slicesContainer;
        slicesContainer.setAll({ isMeasured: true, position: "relative", width: percent(100), height: percent(100) });
        slicesContainer.onPrivate("width", () => {
            this.markDirtySize();
        });
        slicesContainer.onPrivate("height", () => {
            this.markDirtySize();
        });
        if (this.get("orientation") == "vertical") {
            this.set("layout", this._root.horizontalLayout);
        }
        else {
            this.set("layout", this._root.verticalLayout);
        }
    }
    processDataItem(dataItem) {
        super.processDataItem(dataItem);
        const slice = this.makeSlice(dataItem);
        slice._setDataItem(dataItem);
        dataItem.set("slice", slice);
        this.makeLink(dataItem);
        const label = this.makeLabel(dataItem);
        label.on("x", () => {
            this._updateTick(dataItem);
        });
        label.on("y", () => {
            this._updateTick(dataItem);
        });
        this.makeTick(dataItem);
        slice.events.on("positionchanged", () => {
            label.markDirty();
        });
        slice.events.on("boundschanged", () => {
            const dataItem = slice.dataItem;
            if (dataItem) {
                this._updateTick(dataItem);
            }
        });
    }
    _updateChildren() {
        this._opposite = false;
        if (this.children.indexOf(this.labelsContainer) == 0) {
            this._opposite = true;
        }
        let total = 0;
        let count = 0;
        $array.each(this.dataItems, (dataItem) => {
            const value = dataItem.get("value");
            if ($type.isNumber(value)) {
                count++;
                if (value > 0) {
                    total += Math.abs(dataItem.get("valueWorking", value) / value);
                }
                else {
                    if (this.get("ignoreZeroValues", false)) {
                        count--;
                    }
                    else {
                        if (dataItem.isHidden()) {
                            count--;
                        }
                        else {
                            total += 1;
                        }
                    }
                }
            }
        });
        this._total = 1 / count * total;
        this._count = count;
        if (this.isDirty("alignLabels")) {
            this._fixLayout();
        }
        if (this._total > 0 && (this._valuesDirty || this._sizeDirty)) {
            const slicesContainer = this.slicesContainer;
            let h;
            if (this.get("orientation") == "vertical") {
                h = slicesContainer.innerHeight();
            }
            else {
                h = slicesContainer.innerWidth();
            }
            this._nextCoord = this.get("startLocation", 0) * h;
            this.markDirtyBounds();
            let i = 0;
            $array.each(this._dataItems, (dataItem) => {
                this.updateLegendValue(dataItem);
                dataItem.set("index", i);
                i++;
                const slice = dataItem.get("slice");
                const tick = dataItem.get("tick");
                const label = dataItem.get("label");
                const link = dataItem.get("link");
                const color = dataItem.get("fill");
                slice._setDefault("fill", color);
                slice._setDefault("stroke", color);
                link._setDefault("fill", color);
                link._setDefault("stroke", color);
                const value = dataItem.get("value");
                if ($type.isNumber(value)) {
                    if (value == 0 && this.get("ignoreZeroValues")) {
                        slice.setPrivate("visible", false);
                        tick.setPrivate("visible", false);
                        label.setPrivate("visible", false);
                    }
                    else {
                        slice.setPrivate("visible", true);
                        tick.setPrivate("visible", true);
                        label.setPrivate("visible", true);
                        this.decorateSlice(dataItem);
                        if (this.isLast(dataItem)) {
                            link.setPrivate("visible", false);
                        }
                        else if (!dataItem.isHidden()) {
                            link.setPrivate("visible", true);
                        }
                    }
                }
            });
        }
        super._updateChildren();
    }
    _fixLayout() {
        const orientation = this.get("orientation");
        const labelsContainer = this.labelsContainer;
        const labelsTemplate = this.labels.template;
        if (this.get("alignLabels")) {
            labelsContainer.set("position", "relative");
            labelsContainer.setAll({ isMeasured: true });
            if (orientation == "vertical") {
                this.set("layout", this._root.horizontalLayout);
                labelsTemplate.setAll({ centerX: p100, x: p100 });
            }
            else {
                this.set("layout", this._root.verticalLayout);
                labelsTemplate.setAll({ centerX: 0, x: 0 });
            }
        }
        else {
            labelsContainer.setAll({ isMeasured: false, position: "absolute" });
            if (orientation == "vertical") {
                labelsContainer.setAll({ x: p50 });
                labelsTemplate.setAll({ centerX: p50, x: 0 });
            }
            else {
                labelsContainer.setAll({ y: p50 });
                labelsTemplate.setAll({ centerX: p50, y: 0 });
            }
        }
        this.markDirtySize();
    }
    getNextValue(dataItem) {
        let index = dataItem.get("index");
        let nextValue = dataItem.get("valueWorking", 0);
        if (index < this.dataItems.length - 1) {
            let nextItem = this.dataItems[index + 1];
            nextValue = nextItem.get("valueWorking", 0);
            if (nextItem.isHidden() || (nextItem.get("value") == 0 && this.get("ignoreZeroValues"))) {
                return this.getNextValue(nextItem);
            }
        }
        return nextValue;
    }
    isLast(dataItem) {
        let index = dataItem.get("index");
        if (index == this.dataItems.length - 1) {
            return true;
        }
        else {
            for (let i = index + 1; i < this.dataItems.length; i++) {
                if (!this.dataItems[i].isHidden()) {
                    return false;
                }
            }
        }
        return true;
    }
    decorateSlice(dataItem) {
        const orientation = this.get("orientation");
        const slice = dataItem.get("slice");
        const label = dataItem.get("label");
        const link = dataItem.get("link");
        const slicesContainer = this.slicesContainer;
        let maxWidth = slicesContainer.innerWidth();
        let maxHeight = slicesContainer.innerHeight();
        let maxSize = maxWidth;
        if (orientation == "horizontal") {
            maxSize = maxHeight;
        }
        const nextValue = this.getNextValue(dataItem);
        const value = dataItem.get("value", 0);
        const workingValue = Math.abs(dataItem.get("valueWorking", value));
        const bottomRatio = this.get("bottomRatio", 0);
        const valueHigh = this.getPrivate("valueHigh", 0);
        let d = 1;
        if (value != 0) {
            d = workingValue / Math.abs(value);
        }
        else {
            if (dataItem.isHidden()) {
                d = 0.000001;
            }
        }
        if (this._nextCoord == Infinity) {
            this._nextCoord = 0;
        }
        let topWidth = workingValue / valueHigh * maxSize;
        let bottomWidth = (workingValue - (workingValue - nextValue) * bottomRatio) / valueHigh * maxSize;
        slice.setAll({ topWidth, bottomWidth, orientation });
        link.setAll({ topWidth: bottomWidth, bottomWidth: (workingValue - (workingValue - nextValue)) / valueHigh * maxSize, orientation });
        const startLocation = this.get("startLocation", 0);
        const endLocation = this.get("endLocation", 1);
        if (orientation == "vertical") {
            let linkHeight = link.height() * d;
            maxHeight = maxHeight * (endLocation - startLocation) + linkHeight;
            slice.set("y", this._nextCoord);
            let height = Math.min(100000, Math.max(0, maxHeight / this._count * d / this._total - linkHeight));
            slice.setAll({ height, x: maxWidth / 2 });
            let labelY = this._nextCoord + height / 2;
            label.set("y", labelY);
            this._nextCoord += height + linkHeight;
            link.setAll({ y: this._nextCoord - linkHeight, x: maxWidth / 2 });
        }
        else {
            let linkHeight = link.width() * d;
            maxWidth = maxWidth * (endLocation - startLocation) + linkHeight;
            slice.set("x", this._nextCoord);
            let width = Math.min(100000, Math.max(0, maxWidth / this._count * d / this._total - linkHeight));
            slice.setAll({ width, y: maxHeight / 2 });
            const labelX = this._nextCoord + width / 2;
            label.set("x", labelX);
            this._nextCoord += width + linkHeight;
            link.setAll({ x: this._nextCoord - linkHeight, y: maxHeight / 2 });
        }
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
            dataItem.get("link").hide(duration);
            return _super.hideDataItem.call(this, dataItem, duration);
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
            dataItem.get("link").show(duration);
            return _super.showDataItem.call(this, dataItem, duration);
        });
    }
    _updateTick(dataItem) {
        if (this.get("alignLabels")) {
            const tick = dataItem.get("tick");
            const label = dataItem.get("label");
            const slice = dataItem.get("slice");
            if (tick && slice && label) {
                const labelsContainer = this.labelsContainer;
                const slicesContainer = this.slicesContainer;
                let tickLocation = tick.get("location", 0.5);
                const lcw = labelsContainer.width();
                const lch = labelsContainer.height();
                const pl = labelsContainer.get("paddingLeft", 0);
                const pr = labelsContainer.get("paddingRight", 0);
                const pt = labelsContainer.get("paddingTop", 0);
                const pb = labelsContainer.get("paddingBottom", 0);
                let p0 = { x: 0, y: 0 };
                let p1 = { x: 0, y: 0 };
                let p2 = { x: 0, y: 0 };
                if (this._opposite) {
                    tickLocation = 1 - tickLocation;
                }
                if (this.get("orientation") == "vertical") {
                    p0 = slice.getPoint(tickLocation, 0.5);
                    p0.x += slice.x() + slicesContainer.x();
                    p0.y += slice.y() + slicesContainer.y();
                    if (this._opposite) {
                        p1.x = lcw;
                        p1.y = label.y();
                        p2.x = lcw - pl;
                        p2.y = p1.y;
                    }
                    else {
                        p1.x = slicesContainer.x() + slicesContainer.width();
                        p1.y = label.y();
                        p2.x = p1.x + lcw - label.width() - pr;
                        p2.y = p1.y;
                    }
                }
                else {
                    p0 = slice.getPoint(0.5, tickLocation);
                    p0.x += slice.x() + slicesContainer.x();
                    p0.y += slice.y() + slicesContainer.y();
                    if (this._opposite) {
                        p1.y = lch;
                        p1.x = label.x();
                        p2.y = lch - pt;
                        p2.x = p1.x;
                    }
                    else {
                        p1.y = slicesContainer.y() + slicesContainer.height();
                        p1.x = label.x();
                        p2.y = p1.y + lch - label.height() - pb;
                        p2.x = p1.x;
                    }
                }
                tick.set("points", [p0, p1, p2]);
            }
        }
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        let link = dataItem.get("link");
        if (link) {
            this.links.removeValue(link);
            link.dispose();
        }
    }
    _positionBullet(bullet) {
        const sprite = bullet.get("sprite");
        if (sprite) {
            const dataItem = sprite.dataItem;
            const slice = dataItem.get("slice");
            if (slice) {
                const width = slice.width();
                const height = slice.height();
                const locationX = bullet.get("locationX", 0.5);
                const locationY = bullet.get("locationY", 0.5);
                let dx = 0;
                let dy = 0;
                if (this.get("orientation") == "horizontal") {
                    dy = height / 2;
                }
                else {
                    dx = width / 2;
                }
                sprite.setAll({ x: slice.x() + width * locationX - dx, y: slice.y() - dy + height * locationY });
            }
        }
    }
}
Object.defineProperty(FunnelSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "FunnelSeries"
});
Object.defineProperty(FunnelSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PercentSeries.classNames.concat([FunnelSeries.className])
});
//# sourceMappingURL=FunnelSeries.js.map
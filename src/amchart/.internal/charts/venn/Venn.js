import { __awaiter } from "tslib";
import { VennDefaultTheme } from "./VennDefaultTheme";
import { Series } from "../../core/render/Series";
import { Template } from "../../core/util/Template";
import { Graphics, visualSettings } from "../../core/render/Graphics";
import { Container } from "../../core/render/Container";
import { Label } from "../../core/render/Label";
import { ListTemplate } from "../../core/util/List";
import * as $utils from "../../core/util/Utils";
import * as $array from "../../core/util/Array";
import * as $type from "../../core/util/Type";
import * as venn from "./vennjs/index.js";
/**
 * Creates a Venn diagram.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/venn/} for more info
 * @important
 */
export class Venn extends Series {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_sets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        /**
         * A [[Container]] that holds all slices (circles and intersections).
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "slicesContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, {}))
        });
        /**
         * A [[Container]] that holds all labels.
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "labelsContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, {}))
        });
        /**
         * A [[Graphics]] element that is used to show the shape of the hovered slice
         * or intersection.
         *
         * @default Graphics.new()
         */
        Object.defineProperty(this, "hoverGraphics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.slicesContainer.children.push(Graphics.new(this._root, { position: "absolute", isMeasured: false }))
        });
        Object.defineProperty(this, "_hovered", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
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
    }
    _afterNew() {
        this._defaultThemes.push(VennDefaultTheme.new(this._root));
        this.fields.push("intersections", "category", "fill");
        super._afterNew();
    }
    /**
     * @ignore
     */
    makeSlice(dataItem) {
        const slice = this.slicesContainer.children.push(this.slices.make());
        slice.events.on("pointerover", (e) => {
            this._hovered = e.target;
            this._updateHover();
        });
        slice.events.on("pointerout", () => {
            this._hovered = undefined;
            this.hoverGraphics.hide();
        });
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
    _updateHover() {
        if (this._hovered) {
            const hoverGraphics = this.hoverGraphics;
            hoverGraphics.set("svgPath", this._hovered.get("svgPath"));
            hoverGraphics.show();
            hoverGraphics.toFront();
        }
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
    _makeSlices() {
        return new ListTemplate(Template.new({}), () => Graphics._new(this._root, {
            themeTags: $utils.mergeTags(this.slices.template.get("themeTags", []), ["venn", "series"])
        }, [this.slices.template]));
    }
    _makeLabels() {
        return new ListTemplate(Template.new({}), () => Label._new(this._root, {
            themeTags: $utils.mergeTags(this.labels.template.get("themeTags", []), ["venn", "series"])
        }, [this.labels.template]));
    }
    processDataItem(dataItem) {
        super.processDataItem(dataItem);
        if (dataItem.get("fill") == null) {
            let colors = this.get("colors");
            if (colors) {
                dataItem.setRaw("fill", colors.next());
            }
        }
        this.makeSlice(dataItem);
        this.makeLabel(dataItem);
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this._valuesDirty || this._sizeDirty) {
            const sets = [];
            // prepare data for venn
            $array.each(this.dataItems, (dataItem) => {
                const set = {};
                const intersections = dataItem.get("intersections");
                if (intersections) {
                    set.sets = intersections;
                }
                else {
                    set.sets = [dataItem.get("category")];
                }
                set.size = dataItem.get("valueWorking");
                if (set.size > 0) {
                    sets.push(set);
                }
            });
            const newSets = sets.toString();
            this._sets = newSets;
            if (sets.length > 0) {
                let vennData = venn.venn(sets);
                vennData = venn.normalizeSolution(vennData, null, null);
                vennData = venn.scaleSolution(vennData, this.innerWidth(), this.innerHeight(), 0);
                const circles = {};
                for (let name in vennData) {
                    let item = vennData[name];
                    let r = item.radius;
                    const dataItem = this.getDataItemByCategory(name);
                    if (dataItem) {
                        const slice = dataItem.get("slice");
                        const color = dataItem.get("fill");
                        slice._setDefault("fill", color);
                        slice._setDefault("stroke", color);
                        this.updateLegendMarker(dataItem);
                        slice.set("svgPath", "M" + item.x + "," + item.y + " m -" + r + ", 0 a " + r + "," + r + " 0 1,1 " + r * 2 + ",0 a " + r + "," + r + " 0 1,1 -" + r * 2 + ",0");
                        circles[name] = item;
                    }
                }
                let centers = venn.computeTextCentres(circles, sets);
                $array.each(this.dataItems, (dataItem) => {
                    let name = dataItem.get("category");
                    let center = centers[name];
                    const intersections = dataItem.get("intersections");
                    if (intersections) {
                        name = intersections.toString();
                        center = centers[name];
                        if (center) {
                            let set = intersections;
                            let cc = [];
                            for (let s = 0; s < set.length; s++) {
                                cc.push(circles[set[s]]);
                            }
                            let intersectionPath = venn.intersectionAreaPath(cc);
                            let slice = dataItem.get("slice");
                            const color = dataItem.get("fill");
                            slice._setDefault("fill", color);
                            slice._setDefault("stroke", color);
                            slice.setAll({ svgPath: intersectionPath });
                        }
                    }
                    if (center) {
                        let label = dataItem.get("label");
                        label.setAll({ x: center.x, y: center.y });
                    }
                    this.updateLegendValue(dataItem);
                });
            }
            this._updateHover();
        }
    }
    /**
     * Looks up and returns a data item by its category.
     *
     * @param   category  Category
     * @return      Data item
     */
    getDataItemByCategory(id) {
        return $array.find(this.dataItems, (dataItem) => {
            return dataItem.get("category") == id;
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
            let value = dataItem.get("value");
            const animation = dataItem.animate({ key: "valueWorking", to: value, duration: duration, easing: easing });
            if (animation) {
                promises.push(animation.waitForStop());
            }
            const label = dataItem.get("label");
            if (label) {
                promises.push(label.show(duration));
            }
            const slice = dataItem.get("slice");
            if (slice) {
                promises.push(slice.show(duration));
            }
            const intersections = dataItem.get("intersections");
            if (intersections) {
                $array.each(intersections, (cat) => {
                    const di = this.getDataItemByCategory(cat);
                    if (di && di.isHidden()) {
                        this.showDataItem(di, duration);
                    }
                });
            }
            if (!intersections) {
                const category = dataItem.get("category");
                $array.each(this.dataItems, (di) => {
                    const intersections = di.get("intersections");
                    if (di != dataItem && intersections) {
                        let allVisible = true;
                        $array.each(intersections, (cat) => {
                            const dii = this.getDataItemByCategory(cat);
                            if (dii && dii.isHidden()) {
                                allVisible = false;
                            }
                        });
                        if (allVisible && intersections.indexOf(category) != -1) {
                            if (di.isHidden()) {
                                this.showDataItem(di, duration);
                            }
                        }
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
            const hiddenState = this.states.create("hidden", {});
            if (!$type.isNumber(duration)) {
                duration = hiddenState.get("stateAnimationDuration", this.get("stateAnimationDuration", 0));
            }
            const easing = hiddenState.get("stateAnimationEasing", this.get("stateAnimationEasing"));
            const animation = dataItem.animate({ key: "valueWorking", to: 0, duration: duration, easing: easing });
            if (animation) {
                promises.push(animation.waitForStop());
            }
            const label = dataItem.get("label");
            if (label) {
                promises.push(label.hide(duration));
            }
            const slice = dataItem.get("slice");
            if (slice) {
                promises.push(slice.hide(duration));
                slice.hideTooltip();
            }
            if (!dataItem.get("intersections")) {
                $array.each(this.dataItems, (di) => {
                    const intersections = di.get("intersections");
                    if (di != dataItem && intersections) {
                        if (intersections.indexOf(dataItem.get("category")) != -1) {
                            this.hideDataItem(di, duration);
                        }
                    }
                });
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
        let slice = dataItem.get("slice");
        if (slice) {
            this.slices.removeValue(slice);
            slice.dispose();
        }
    }
    /**
     * @ignore
     */
    updateLegendMarker(dataItem) {
        const slice = dataItem.get("slice");
        if (slice) {
            const legendDataItem = dataItem.get("legendDataItem");
            if (legendDataItem) {
                const markerRectangle = legendDataItem.get("markerRectangle");
                $array.each(visualSettings, (setting) => {
                    markerRectangle.set(setting, slice.get(setting));
                });
            }
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
}
Object.defineProperty(Venn, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Venn"
});
Object.defineProperty(Venn, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Series.classNames.concat([Venn.className])
});
//# sourceMappingURL=Venn.js.map
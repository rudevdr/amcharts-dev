import { __awaiter } from "tslib";
import { HierarchyDefaultTheme } from "./HierarchyDefaultTheme";
import { Series } from "../../core/render/Series";
import { DataItem } from "../../core/render/Component";
import { HierarchyNode } from "./HierarchyNode";
import { Container } from "../../core/render/Container";
import { Label } from "../../core/render/Label";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import * as $array from "../../core/util/Array";
import * as $type from "../../core/util/Type";
import * as $utils from "../../core/util/Utils";
import * as d3hierarchy from "d3-hierarchy";
;
/**
 * A base class for all hierarchy charts.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/} for more info
 */
export class Hierarchy extends Series {
    constructor() {
        super(...arguments);
        /**
         * A [[Container]] that nodes are placed in.
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "nodesContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, { isMeasured: false }))
        });
        Object.defineProperty(this, "_rootNode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_treeData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "hierarchy"
        });
        /**
         * A list of nodes in a [[Hierarchy]] chart.
         *
         * @default new ListTemplate<HierarchyNode>
         */
        Object.defineProperty(this, "nodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => HierarchyNode.new(this._root, {
                themeTags: $utils.mergeTags(this.nodes.template.get("themeTags", []), [this._tag, "hierarchy", "node"])
            }, this.nodes.template))
        });
        /**
         * A list of label elements in a [[Hierarchy]] chart.
         *
         * @default new ListTemplate<Label>
         */
        Object.defineProperty(this, "labels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Label.new(this._root, {
                themeTags: $utils.mergeTags(this.labels.template.get("themeTags", []), [this._tag])
            }, this.labels.template))
        });
        Object.defineProperty(this, "_currentDownDepth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    /**
     * @ignore
     */
    makeNode(dataItem) {
        const childData = dataItem.get("childData");
        const node = this.nodes.make();
        node.series = this;
        node._setDataItem(dataItem);
        this.nodes.push(node);
        dataItem.setRaw("node", node);
        const label = this.labels.make();
        label._setDataItem(dataItem);
        dataItem.setRaw("label", label);
        this.labels.push(label);
        if (!childData || childData.length == 0) {
            node.addTag("last");
        }
        const depth = dataItem.get("depth");
        node.addTag("depth" + depth);
        this.nodesContainer.children.push(node);
        node.children.push(label);
        return node;
    }
    _afterNew() {
        this._defaultThemes.push(HierarchyDefaultTheme.new(this._root));
        this.fields.push("category", "childData", "disabled", "fill");
        this.children.push(this.bulletsContainer);
        super._afterNew();
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this._valuesDirty) {
            this._treeData = {};
            const first = this.dataItems[0];
            if (first) {
                this._makeHierarchyData(this._treeData, first);
                this._index = 0;
                this._rootNode = d3hierarchy.hierarchy(this._treeData);
                if (this._rootNode) {
                    this._rootNode.sum((d) => {
                        return d.value;
                    });
                    const sort = this.get("sort");
                    if (sort == "descending") {
                        this._rootNode.sort((a, b) => b.value - a.value);
                    }
                    else if (sort == "ascending") {
                        this._rootNode.sort((a, b) => a.value - b.value);
                    }
                    this.setPrivateRaw("valueLow", Infinity);
                    this.setPrivateRaw("valueHigh", -Infinity);
                    this.setPrivateRaw("maxDepth", 0);
                    this._updateValues(this._rootNode);
                }
            }
        }
        if (this._valuesDirty || this._sizeDirty) {
            this._updateVisuals();
        }
        if (this._sizeDirty) {
            const dataItem = this.get("selectedDataItem");
            if (dataItem) {
                this._zoom(dataItem);
            }
        }
    }
    _changed() {
        super._changed();
        if (this.isDirty("selectedDataItem")) {
            this._selectDataItem(this.get("selectedDataItem"));
        }
    }
    _updateVisuals() {
        if (this._rootNode) {
            this._updateNodes(this._rootNode);
        }
    }
    _updateNodes(hierarchyNode) {
        const dataItem = hierarchyNode.data.dataItem;
        if (dataItem) {
            this._updateNode(dataItem);
            if (this.bullets.length > 0 && !dataItem.bullets) {
                this._makeBullets(dataItem);
            }
            const hierarchyChildren = hierarchyNode.children;
            if (hierarchyChildren) {
                $array.each(hierarchyChildren, (hierarchyChild) => {
                    this._updateNodes(hierarchyChild);
                });
            }
        }
    }
    _updateNode(_dataItem) {
    }
    /**
     * Looks up and returns a data item by its ID.
     *
     * @param   id  ID
     * @return      Data item
     */
    getDataItemById(id) {
        return this._getDataItemById(this.dataItems, id);
    }
    _getDataItemById(dataItems, id) {
        let di;
        $array.each(dataItems, (dataItem) => {
            if (dataItem.get("id") == id) {
                di = dataItem;
            }
            const children = dataItem.get("children");
            if (children) {
                let childDataItem = this._getDataItemById(children, id);
                if (childDataItem) {
                    di = childDataItem;
                }
            }
        });
        return di;
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
            const children = dataItem.get("children");
            if (children) {
                this._handleBullets(children);
            }
        });
        this._updateVisuals();
    }
    _onDataClear() {
        super._onDataClear();
        const colors = this.get("colors");
        if (colors) {
            colors.reset();
        }
    }
    processDataItem(dataItem) {
        super.processDataItem(dataItem);
        const childData = dataItem.get("childData");
        const colors = this.get("colors");
        const topDepth = this.get("topDepth", 0);
        if (!dataItem.get("parent")) {
            dataItem.setRaw("depth", 0);
            if (colors && topDepth == 0 && dataItem.get("fill") == null) {
                dataItem.setRaw("fill", colors.next());
            }
        }
        let depth = dataItem.get("depth");
        const initialDepth = this.get("initialDepth", 1);
        this.makeNode(dataItem);
        this._processDataItem(dataItem);
        if (childData) {
            const children = [];
            dataItem.setRaw("children", children);
            $array.each(childData, (child) => {
                const childDataItem = new DataItem(this, child, this._makeDataItem(child));
                children.push(childDataItem);
                childDataItem.setRaw("parent", dataItem);
                childDataItem.setRaw("depth", depth + 1);
                if (this.dataItems.length == 1 && depth == 0) {
                    if (colors && childDataItem.get("fill") == null) {
                        childDataItem.setRaw("fill", colors.next());
                    }
                }
                else {
                    if (childDataItem.get("fill") == null) {
                        childDataItem.setRaw("fill", dataItem.get("fill"));
                    }
                }
                this.processDataItem(childDataItem);
            });
        }
        const children = dataItem.get("children");
        if (!children || children.length == 0) {
            const node = dataItem.get("node");
            node.setAll({ toggleKey: undefined });
        }
        if (dataItem.get("disabled") == null) {
            if (depth >= topDepth + initialDepth) {
                this.disableDataItem(dataItem, 0);
            }
        }
    }
    /**
     * Adds children data to the target data item.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/hierarchy-api/#Dynamically_adding_child_nodes} for more info
     * @since 5.4.5
     */
    addChildData(dataItem, data) {
        const dataContext = dataItem.dataContext;
        const childDataField = this.get("childDataField");
        let childData = dataContext[childDataField];
        if (!childData) {
            childData = data;
            dataContext[childDataField] = childData;
        }
        else {
            childData.push(...data);
        }
        let children = dataItem.get("children");
        if (!children) {
            children = [];
            dataItem.set("children", children);
        }
        let depth = dataItem.get("depth");
        $array.each(childData, (child) => {
            const childDataItem = new DataItem(this, child, this._makeDataItem(child));
            children.push(childDataItem);
            childDataItem.setRaw("parent", dataItem);
            childDataItem.setRaw("depth", depth + 1);
            if (childDataItem.get("fill") == null) {
                childDataItem.setRaw("fill", dataItem.get("fill"));
            }
            this.processDataItem(childDataItem);
        });
    }
    _processDataItem(_dataItem) {
    }
    _updateValues(d3HierarchyNode) {
        const dataItem = d3HierarchyNode.data.dataItem;
        if (d3HierarchyNode.depth > this.getPrivate("maxDepth")) {
            this.setPrivateRaw("maxDepth", d3HierarchyNode.depth);
        }
        if (dataItem) {
            dataItem.setRaw("d3HierarchyNode", d3HierarchyNode);
            d3HierarchyNode.index = this._index;
            this._index++;
            dataItem.get("node").set("disabled", dataItem.get("disabled"));
            let dataValue = d3HierarchyNode.data.value;
            let value = d3HierarchyNode.value;
            if (dataValue != null) {
                value = dataValue;
                d3HierarchyNode["value"] = value;
            }
            if ($type.isNumber(value)) {
                dataItem.setRaw("sum", value);
                dataItem.setRaw("valuePercentTotal", value / this.dataItems[0].get("sum") * 100);
                let valuePercent = 100;
                const parent = dataItem.get("parent");
                if (parent) {
                    valuePercent = value / parent.get("sum") * 100;
                }
                dataItem.get("label").text.markDirtyText();
                dataItem.setRaw("valuePercent", valuePercent);
                if (this.getPrivate("valueLow") > value) {
                    this.setPrivateRaw("valueLow", value);
                }
                if (this.getPrivate("valueHigh") < value) {
                    this.setPrivateRaw("valueHigh", value);
                }
            }
            this.updateLegendValue(dataItem);
        }
        const hierarchyChildren = d3HierarchyNode.children;
        if (hierarchyChildren) {
            $array.each(hierarchyChildren, (d3HierarchyChild) => {
                this._updateValues(d3HierarchyChild);
            });
        }
    }
    _makeHierarchyData(data, dataItem) {
        data.dataItem = dataItem;
        const children = dataItem.get("children");
        if (children) {
            const childrenDataArray = [];
            data.children = childrenDataArray;
            $array.each(children, (childDataItem) => {
                const childData = {};
                childrenDataArray.push(childData);
                this._makeHierarchyData(childData, childDataItem);
            });
            const value = dataItem.get("valueWorking");
            if ($type.isNumber(value)) {
                data.value = value;
            }
        }
        else {
            const value = dataItem.get("valueWorking");
            if ($type.isNumber(value)) {
                data.value = value;
            }
        }
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        const node = dataItem.get("node");
        if (node) {
            this.nodes.removeValue(node);
            node.dispose();
        }
        const label = dataItem.get("label");
        if (label) {
            this.labels.removeValue(label);
            label.dispose();
        }
        const children = dataItem.get("children");
        if (children) {
            $array.each(children, (child) => {
                this.disposeDataItem(child);
            });
        }
    }
    /**
     * Hides hierarchy's data item.
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
                const stateAnimationDuration = "stateAnimationDuration";
                duration = hiddenState.get(stateAnimationDuration, this.get(stateAnimationDuration, 0));
            }
            const stateAnimationEasing = "stateAnimationEasing";
            const easing = hiddenState.get(stateAnimationEasing, this.get(stateAnimationEasing));
            const children = dataItem.get("children");
            if ((!children || children.length == 0) && $type.isNumber(dataItem.get("value"))) {
                promises.push(dataItem.animate({ key: "valueWorking", to: 0, duration: duration, easing: easing }).waitForStop());
            }
            const node = dataItem.get("node");
            node.hide();
            node.hideTooltip();
            if (children) {
                $array.each(children, (childDataItem) => {
                    promises.push(this.hideDataItem(childDataItem));
                });
            }
            yield Promise.all(promises);
        });
    }
    /**
     * Shows hierarchy's data item.
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
            const children = dataItem.get("children");
            if ((!children || children.length == 0) && $type.isNumber(dataItem.get("value"))) {
                promises.push(dataItem.animate({ key: "valueWorking", to: dataItem.get("value"), duration: duration, easing: easing }).waitForStop());
            }
            const node = dataItem.get("node");
            node.show();
            if (children) {
                $array.each(children, (childDataItem) => {
                    promises.push(this.showDataItem(childDataItem));
                });
            }
            yield Promise.all(promises);
        });
    }
    /**
     * Enables a disabled data item.
     *
     * @param  dataItem  Target data item
     * @param  duration  Animation duration in milliseconds
     */
    enableDataItem(dataItem, maxDepth, depth, duration) {
        if (depth == null) {
            depth = 0;
        }
        if (maxDepth == null) {
            maxDepth = 1;
        }
        dataItem.set("disabled", false);
        dataItem.get("node").set("disabled", false);
        if (!dataItem.isHidden()) {
            dataItem.get("node").show(duration);
        }
        const topDepth = this.get("topDepth", 0);
        if (dataItem.get("depth") < topDepth) {
            dataItem.get("node").hide(0);
        }
        if (depth == 0) {
            const upDepth = this.get("upDepth", Infinity);
            let parent = dataItem;
            let count = 0;
            while (parent !== undefined) {
                if (count > upDepth) {
                    parent.get("node").hide();
                }
                parent = parent.get("parent");
                count++;
            }
        }
        let children = dataItem.get("children");
        if (children) {
            if (depth < maxDepth - 1) {
                $array.each(children, (child) => {
                    const disabledField = this.get("disabledField");
                    if (disabledField) {
                        const dataContext = child.dataContext;
                        if (dataContext[disabledField] != true) {
                            this.enableDataItem(child, maxDepth, depth + 1, duration);
                        }
                        else {
                            this.disableDataItem(child);
                        }
                    }
                    else {
                        this.enableDataItem(child, maxDepth, depth + 1, duration);
                    }
                });
            }
            else {
                $array.each(children, (child) => {
                    if (!child.isHidden()) {
                        child.get("node").show(duration);
                        child.get("node").states.applyAnimate("disabled");
                        child.set("disabled", true);
                        this.disableDataItem(child);
                    }
                });
            }
        }
    }
    /**
     * Disables a data item.
     *
     * @param  dataItem  Target data item
     * @param  duration  Animation duration in milliseconds
     */
    disableDataItem(dataItem, duration) {
        dataItem.set("disabled", true);
        let children = dataItem.get("children");
        if (children) {
            $array.each(children, (child) => {
                this.disableDataItem(child, duration);
                child.get("node").hide(duration);
            });
        }
    }
    _selectDataItem(dataItem, downDepth, skipDisptach) {
        if (dataItem) {
            if (!skipDisptach) {
                const type = "dataitemselected";
                this.events.dispatch(type, { type: type, target: this, dataItem: dataItem });
            }
            let maxDepth = this.getPrivate("maxDepth", 1);
            const topDepth = this.get("topDepth", 0);
            if (downDepth == null) {
                downDepth = Math.min(this.get("downDepth", 1), maxDepth - dataItem.get("depth"));
            }
            if (!this.inited) {
                downDepth = Math.min(this.get("initialDepth", 1), maxDepth - topDepth);
            }
            this._currentDownDepth = downDepth;
            const hierarchyNode = dataItem.get("d3HierarchyNode");
            let currentDepth = hierarchyNode.depth;
            if (currentDepth + downDepth > maxDepth) {
                downDepth = maxDepth - currentDepth;
            }
            if (currentDepth < topDepth) {
                downDepth += topDepth - currentDepth;
                currentDepth = topDepth;
            }
            const children = dataItem.get("children");
            if (children && children.length > 0) {
                if (downDepth > 0) {
                    this.enableDataItem(dataItem, downDepth);
                }
                else {
                    dataItem.get("node").show();
                    $array.each(children, (child) => {
                        child.get("node").hide();
                    });
                }
                if (hierarchyNode.depth < topDepth) {
                    dataItem.get("node").hide(0);
                }
                if (this.get("singleBranchOnly")) {
                    this._handleSingle(dataItem);
                }
            }
            else {
                this.enableDataItem(this.dataItems[0], downDepth, 0);
            }
            this._root.events.once("frameended", () => {
                this._zoom(dataItem);
            });
        }
    }
    _zoom(_dataItem) {
    }
    _handleSingle(dataItem) {
        const parent = dataItem.get("parent");
        if (parent) {
            const children = parent.get("children");
            if (children) {
                $array.each(children, (child) => {
                    if (child != dataItem) {
                        this.disableDataItem(child);
                    }
                });
            }
        }
    }
    /**
     * Selects specific data item.
     *
     * @param  dataItem  Target data item
     */
    selectDataItem(dataItem) {
        const parent = dataItem.get("parent");
        const maxDepth = this.getPrivate("maxDepth", 1);
        if (this.get("selectedDataItem") == dataItem) {
            if (parent) {
                this.set("selectedDataItem", parent);
            }
            else {
                let depth = Math.min(this.get("downDepth", 1), maxDepth - dataItem.get("depth"));
                if (this._currentDownDepth == depth) {
                    depth = Math.min(this.get("initialDepth", 1), maxDepth - this.get("topDepth", 0));
                }
                this._selectDataItem(dataItem, depth);
            }
        }
        else {
            this.set("selectedDataItem", dataItem);
        }
    }
    _makeBullet(dataItem, bulletFunction, index) {
        const bullet = super._makeBullet(dataItem, bulletFunction, index);
        if (bullet) {
            const sprite = bullet.get("sprite");
            const node = dataItem.get("node");
            if (sprite) {
                node.children.push(sprite);
                node.on("width", () => {
                    this._positionBullet(bullet);
                });
                node.on("height", () => {
                    this._positionBullet(bullet);
                });
            }
        }
        return bullet;
    }
    _positionBullet(bullet) {
        const sprite = bullet.get("sprite");
        if (sprite) {
            const dataItem = sprite.dataItem;
            const locationX = bullet.get("locationX", 0.5);
            const locationY = bullet.get("locationY", 0.5);
            const node = dataItem.get("node");
            sprite.set("x", node.width() * locationX);
            sprite.set("y", node.height() * locationY);
        }
    }
    /**
     * Triggers hover on a series data item.
     *
     * @since 5.0.7
     * @param  dataItem  Target data item
     */
    hoverDataItem(dataItem) {
        const node = dataItem.get("node");
        if (node && !node.isHidden()) {
            node.hover();
        }
    }
    /**
     * Triggers un-hover on a series data item.
     *
     * @since 5.0.7
     * @param  dataItem  Target data item
     */
    unhoverDataItem(dataItem) {
        const node = dataItem.get("node");
        if (node) {
            node.unhover();
        }
    }
}
Object.defineProperty(Hierarchy, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Hierarchy"
});
Object.defineProperty(Hierarchy, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Series.classNames.concat([Hierarchy.className])
});
//# sourceMappingURL=Hierarchy.js.map
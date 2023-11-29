import { __awaiter } from "tslib";
import { FlowDefaultTheme } from "./FlowDefaultTheme";
import { Series } from "../../core/render/Series";
import { Container } from "../../core/render/Container";
import { LinearGradient } from "../../core/render/gradients/LinearGradient";
import * as $array from "../../core/util/Array";
import * as $type from "../../core/util/Type";
/**
 * A base class for all flow type series: [[Sankey]] and [[Chord]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/flow-charts/} for more info
 */
export class Flow extends Series {
    constructor() {
        super(...arguments);
        /**
         * Container series will place their links in.
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "linksContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Container.new(this._root, {}))
        });
        Object.defineProperty(this, "_nodesData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_linksData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_nodesDataSet", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_linksByIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
    }
    _afterNew() {
        this._defaultThemes.push(FlowDefaultTheme.new(this._root));
        this.fields.push("disabled", "sourceId", "targetId");
        if (this.nodes) {
            this.nodes.flow = this;
        }
        super._afterNew();
        this.children.push(this.bulletsContainer);
    }
    processDataItem(dataItem) {
        super.processDataItem(dataItem);
        const nodes = this.nodes;
        if (nodes) {
            let unknown = false;
            let sourceId = dataItem.get("sourceId");
            let sourceDataItem = nodes.getDataItemById(sourceId);
            if (!sourceDataItem) {
                if (sourceId == null) {
                    sourceId = "undefined" + this._index;
                    this._index++;
                    unknown = true;
                }
                nodes.data.push({ id: sourceId, unknown: unknown });
                sourceDataItem = nodes.getDataItemById(sourceId);
                if (!unknown) {
                    sourceDataItem.set("name", sourceId);
                }
            }
            unknown = false;
            let targetId = dataItem.get("targetId");
            let targetDataItem = nodes.getDataItemById(targetId);
            if (!targetDataItem) {
                if (targetId == null) {
                    targetId = "undefined" + this._index;
                    this._index++;
                    unknown = true;
                }
                nodes.data.push({ id: targetId, unknown: unknown });
                targetDataItem = nodes.getDataItemById(targetId);
                if (!unknown) {
                    targetDataItem.set("name", targetId);
                }
            }
            if (sourceDataItem) {
                dataItem.set("source", sourceDataItem);
                nodes.addOutgoingLink(sourceDataItem, dataItem);
            }
            if (targetDataItem) {
                dataItem.set("target", targetDataItem);
                nodes.addincomingLink(targetDataItem, dataItem);
            }
            dataItem.set("link", this.makeLink(dataItem));
            const sourceIndex = this.nodes.dataItems.indexOf(sourceDataItem);
            const targetIndex = this.nodes.dataItems.indexOf(targetDataItem);
            this._linksByIndex[sourceIndex + "_" + targetIndex] = dataItem;
            if (sourceDataItem.get("unknown")) {
                if (targetDataItem) {
                    sourceDataItem.set("fill", targetDataItem.get("fill"));
                }
                dataItem.get("link").set("fillStyle", "gradient");
            }
            if (targetDataItem.get("unknown")) {
                if (sourceDataItem) {
                    targetDataItem.set("fill", sourceDataItem.get("fill"));
                }
                dataItem.get("link").set("fillStyle", "gradient");
            }
            this._updateLinkColor(dataItem);
        }
    }
    _onDataClear() {
        if (!this.nodes._userDataSet) {
            this.nodes.data.setAll([]);
            this.nodes._userDataSet = false;
        }
    }
    _prepareChildren() {
        super._prepareChildren();
        let valueLow = Infinity;
        let valueHigh = -Infinity;
        let valueSum = 0;
        if (this._valuesDirty) {
            this._nodesData = [];
            const nodes = this.nodes;
            if (nodes) {
                $array.each(nodes.dataItems, (dataItem) => {
                    const d3SankeyNode = dataItem.get("d3SankeyNode");
                    this._nodesData.push(d3SankeyNode);
                    const incoming = dataItem.get("incomingLinks");
                    let sumIncoming = 0;
                    let sumIncomingWorking = 0;
                    if (incoming) {
                        $array.each(incoming, (link) => {
                            const value = link.get("value");
                            const workingValue = link.get("valueWorking");
                            sumIncoming += value;
                            sumIncomingWorking += workingValue;
                        });
                    }
                    dataItem.set("sumIncoming", sumIncoming);
                    dataItem.set("sumIncomingWorking", sumIncomingWorking);
                    const outgoing = dataItem.get("outgoingLinks");
                    let sumOutgoing = 0;
                    let sumOutgoingWorking = 0;
                    if (outgoing) {
                        $array.each(outgoing, (link) => {
                            const value = link.get("value");
                            const workingValue = link.get("valueWorking");
                            sumOutgoing += value;
                            sumOutgoingWorking += workingValue;
                        });
                    }
                    dataItem.set("sumOutgoing", sumOutgoing);
                    dataItem.set("sumOutgoingWorking", sumOutgoingWorking);
                    dataItem.set("sum", sumIncoming + sumOutgoing);
                    dataItem.set("sumWorking", sumIncomingWorking + sumOutgoingWorking);
                    nodes.updateLegendValue(dataItem);
                });
            }
            this._linksData = [];
            $array.each(this.dataItems, (dataItem) => {
                let value = dataItem.get("value");
                if ($type.isNumber(value)) {
                    if (value < valueLow) {
                        valueLow = value;
                    }
                    if (value > valueHigh) {
                        valueHigh = value;
                    }
                    valueSum += value;
                }
            });
            $array.each(this.dataItems, (dataItem) => {
                let value = dataItem.get("value");
                if ($type.isNumber(value)) {
                    let valueWorking = dataItem.get("valueWorking");
                    let minSize = this.get("minSize", 0);
                    if (minSize > 0) {
                        if (valueWorking < minSize * valueSum) {
                            valueWorking = minSize * valueSum;
                        }
                    }
                    let d3SankeyLink = { source: dataItem.get("source").get("d3SankeyNode"), target: dataItem.get("target").get("d3SankeyNode"), value: valueWorking };
                    dataItem.setRaw("d3SankeyLink", d3SankeyLink);
                    this._linksData.push(d3SankeyLink);
                    this.updateLegendValue(dataItem);
                }
            });
            this.setPrivateRaw("valueHigh", valueHigh);
            this.setPrivateRaw("valueLow", valueLow);
            this.setPrivateRaw("valueSum", valueSum);
        }
    }
    _updateLinkColor(dataItem) {
        const link = dataItem.get("link");
        const fillStyle = link.get("fillStyle");
        const strokeStyle = link.get("strokeStyle");
        const source = dataItem.get("source");
        const target = dataItem.get("target");
        const sourceFill = source.get("fill");
        const targetFill = target.get("fill");
        link.remove("fillGradient");
        link.remove("strokeGradient");
        switch (fillStyle) {
            case "solid":
                link._applyTemplates();
                break;
            case "source":
                link.set("fill", sourceFill);
                break;
            case "target":
                link.set("fill", targetFill);
                break;
            case "gradient":
                let gradient = link._fillGradient;
                if (!gradient) {
                    gradient = LinearGradient.new(this._root, {});
                }
                const sourceStop = { color: sourceFill };
                if (source.get("unknown")) {
                    sourceStop.opacity = 0;
                }
                const targetStop = { color: targetFill };
                if (target.get("unknown")) {
                    targetStop.opacity = 0;
                }
                gradient.set("stops", [sourceStop, targetStop]);
                link._fillGradient = gradient;
                link.set("fillGradient", gradient);
                break;
            case "none":
                link.set("fill", undefined); // do not use remove!
                break;
        }
        switch (strokeStyle) {
            case "solid":
                link._applyTemplates();
                break;
            case "source":
                link.set("stroke", sourceFill);
                break;
            case "target":
                link.set("stroke", targetFill);
                break;
            case "gradient":
                let gradient = link._strokeGradient;
                if (!gradient) {
                    gradient = LinearGradient.new(this._root, {});
                    const sourceStop = { color: sourceFill };
                    if (source.get("unknown")) {
                        sourceStop.opacity = 0;
                    }
                    const targetStop = { color: targetFill };
                    if (target.get("unknown")) {
                        targetStop.opacity = 0;
                    }
                    gradient.set("stops", [sourceStop, targetStop]);
                    link._strokeGradient = gradient;
                }
                link.set("strokeGradient", gradient);
                break;
            case "none":
                link.remove("stroke");
                break;
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
    /**
     * Shows diagram's data item.
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
            const stateAnimationDuration = "stateAnimationDuration";
            const stateAnimationEasing = "stateAnimationEasing";
            if (!$type.isNumber(duration)) {
                duration = hiddenState.get(stateAnimationDuration, this.get(stateAnimationDuration, 0));
            }
            const easing = hiddenState.get(stateAnimationEasing, this.get(stateAnimationEasing));
            promises.push(dataItem.animate({
                key: "valueWorking",
                to: Math.max(this.get("minHiddenValue", 0), this.get("hiddenSize", 0) * dataItem.get("value")),
                duration: duration,
                easing: easing
            }).waitForStop());
            const linkGraphics = dataItem.get("link");
            linkGraphics.hide();
            yield Promise.all(promises);
        });
    }
    /**
     * Shows diagram's data item.
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
            promises.push(dataItem.animate({ key: "valueWorking", to: dataItem.get("value"), duration: duration, easing: easing }).waitForStop());
            const linkGraphics = dataItem.get("link");
            linkGraphics.show();
            yield Promise.all(promises);
        });
    }
    _positionBullet(bullet) {
        const sprite = bullet.get("sprite");
        if (sprite) {
            const dataItem = sprite.dataItem;
            if (dataItem) {
                const link = dataItem.get("link");
                const sprite = bullet.get("sprite");
                if (sprite) {
                    const point = link.getPoint(this._getBulletLocation(bullet));
                    sprite.setAll({ x: point.x, y: point.y });
                    if (bullet.get("autoRotate")) {
                        sprite.set("rotation", point.angle + bullet.get("autoRotateAngle", 0));
                    }
                }
            }
        }
    }
    _getBulletLocation(bullet) {
        return bullet.get("locationY", 0);
    }
}
Object.defineProperty(Flow, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Flow"
});
Object.defineProperty(Flow, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Series.classNames.concat([Flow.className])
});
//# sourceMappingURL=Flow.js.map
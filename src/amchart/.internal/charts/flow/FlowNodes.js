import { __awaiter } from "tslib";
import { Label } from "../../core/render/Label";
import { Series } from "../../core/render/Series";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import { FlowNode } from "./FlowNode";
import * as $array from "../../core/util/Array";
/**
 * Holds instances of nodes for a [[Flow]] series.
 */
export class FlowNodes extends Series {
    constructor() {
        super(...arguments);
        /**
         * List of label elements.
         *
         * @default new ListTemplate<Label>
         */
        Object.defineProperty(this, "labels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Label._new(this._root, { themeTags: ["flow"] }, [this.labels.template]))
        });
        /**
         * List of node elements.
         *
         * @default new ListTemplate<FlowNode>
         */
        Object.defineProperty(this, "nodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => FlowNode._new(this._root, { themeTags: ["node"] }, [this.nodes.template]))
        });
        Object.defineProperty(this, "_userDataSet", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    _afterNew() {
        this.fields.push("unknown", "name", "fill");
        this.set("idField", "id");
        this.set("nameField", "id");
        this.set("fillField", "fill");
        this.set("unknownField", "unknown");
        this.children.push(this.bulletsContainer);
        super._afterNew();
    }
    _onDataClear() {
        const colors = this.get("colors");
        if (colors) {
            colors.reset();
        }
        this._userDataSet = true;
    }
    processDataItem(dataItem) {
        super.processDataItem(dataItem);
        dataItem.setRaw("d3SankeyNode", { name: dataItem.get("id"), dataItem: dataItem });
        if (dataItem.get("fill") == null) {
            let colors = this.get("colors");
            if (colors) {
                dataItem.setRaw("fill", colors.next());
            }
        }
        const node = this.makeNode(dataItem);
        dataItem.setRaw("node", node);
        const disabledField = this.get("disabledField");
        if (disabledField) {
            const dataContext = dataItem.dataContext;
            if (dataContext) {
                if (dataContext[disabledField]) {
                    this.root.events.once("frameended", () => {
                        this.disableDataItem(dataItem, 0);
                    });
                }
            }
        }
    }
    /**
     * @ignore
     */
    makeNode(dataItem, themeTag) {
        const node = this.nodes.make();
        this.nodes.push(node);
        if (themeTag) {
            node.addTag(themeTag);
        }
        if (dataItem.get("unknown")) {
            node.addTag("unknown");
        }
        this.children.push(node);
        node._setDataItem(dataItem);
        node.series = this;
        node.events.on("click", (e) => {
            const node = e.target;
            if (node.get("toggleKey") == "disabled") {
                const dataItem = node.dataItem;
                if (dataItem) {
                    if (dataItem.isHidden()) {
                        this.enableDataItem(dataItem);
                    }
                    else {
                        this.disableDataItem(dataItem);
                    }
                }
            }
        });
        dataItem.on("fill", () => {
            this._updateNodeColor(dataItem);
        });
        dataItem.set("node", node);
        return node;
    }
    _updateNodeColor(_dataItem) {
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        let node = dataItem.get("node");
        if (node) {
            this.nodes.removeValue(node);
            node.dispose();
        }
        let label = dataItem.get("label");
        if (label) {
            this.labels.removeValue(label);
            label.dispose();
        }
    }
    /**
     * @ignore
     */
    addincomingLink(dataItem, link) {
        let incoming = dataItem.get("incomingLinks");
        if (!incoming) {
            incoming = [];
            dataItem.set("incomingLinks", incoming);
        }
        incoming.push(link);
    }
    /**
     * @ignore
     */
    addOutgoingLink(dataItem, link) {
        let outgoing = dataItem.get("outgoingLinks");
        if (!outgoing) {
            outgoing = [];
            dataItem.set("outgoingLinks", outgoing);
        }
        outgoing.push(link);
    }
    /**
     * Shows node's data item.
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
            const flow = this.flow;
            if (flow) {
                const node = dataItem.get("node");
                if (node) {
                    node.show();
                }
                let label = dataItem.get("label");
                if (label) {
                    label.show(duration);
                }
                let links = dataItem.get("outgoingLinks");
                if (links) {
                    $array.each(links, (link) => {
                        flow.showDataItem(link, duration);
                    });
                }
                links = dataItem.get("incomingLinks");
                if (links) {
                    $array.each(links, (link) => {
                        flow.showDataItem(link, duration);
                    });
                }
            }
            yield promises;
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
            const flow = this.flow;
            if (flow) {
                const node = dataItem.get("node");
                if (node) {
                    node.hide();
                }
                let label = dataItem.get("label");
                if (label) {
                    label.hide(duration);
                }
                let links = dataItem.get("outgoingLinks");
                if (links) {
                    $array.each(links, (link) => {
                        flow.hideDataItem(link, duration);
                    });
                }
                links = dataItem.get("incomingLinks");
                if (links) {
                    $array.each(links, (link) => {
                        flow.hideDataItem(link, duration);
                    });
                }
            }
            yield promises;
        });
    }
    /**
     * Shows node's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    enableDataItem(dataItem, duration) {
        const _super = Object.create(null, {
            showDataItem: { get: () => super.showDataItem }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [_super.showDataItem.call(this, dataItem, duration)];
            const flow = this.flow;
            if (flow) {
                const node = dataItem.get("node");
                if (node) {
                    this.root.events.once("frameended", () => {
                        node.set("disabled", false);
                    });
                }
                let label = dataItem.get("label");
                if (label) {
                    label.set("disabled", false);
                }
                let links = dataItem.get("outgoingLinks");
                if (links) {
                    $array.each(links, (link) => {
                        flow.showDataItem(link, duration);
                    });
                }
                links = dataItem.get("incomingLinks");
                if (links) {
                    $array.each(links, (link) => {
                        flow.showDataItem(link, duration);
                    });
                }
            }
            yield promises;
        });
    }
    /**
     * Hides series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    disableDataItem(dataItem, duration) {
        const _super = Object.create(null, {
            hideDataItem: { get: () => super.hideDataItem }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [_super.hideDataItem.call(this, dataItem, duration)];
            const flow = this.flow;
            if (flow) {
                const node = dataItem.get("node");
                if (node) {
                    this.root.events.once("frameended", () => {
                        node.set("disabled", true);
                    });
                }
                let label = dataItem.get("label");
                if (label) {
                    label.set("disabled", true);
                }
                let links = dataItem.get("outgoingLinks");
                if (links) {
                    $array.each(links, (link) => {
                        flow.hideDataItem(link, duration);
                    });
                }
                links = dataItem.get("incomingLinks");
                if (links) {
                    $array.each(links, (link) => {
                        flow.hideDataItem(link, duration);
                    });
                }
            }
            yield promises;
        });
    }
}
Object.defineProperty(FlowNodes, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "FlowNodes"
});
Object.defineProperty(FlowNodes, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Series.classNames.concat([FlowNodes.className])
});
//# sourceMappingURL=FlowNodes.js.map
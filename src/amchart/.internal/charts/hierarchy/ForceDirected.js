import { LinkedHierarchy } from "./LinkedHierarchy";
import * as $array from "../../core/util/Array";
import * as $utils from "../../core/util/Utils";
import * as $type from "../../core/util/Type";
import * as d3Force from "d3-force";
;
/**
 * Creates a force-directed tree.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/force-directed/} for more info
 * @important
 */
export class ForceDirected extends LinkedHierarchy {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "forcedirected"
        });
        /**
         * @ignore
         */
        Object.defineProperty(this, "d3forceSimulation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: d3Force.forceSimulation()
        });
        /**
         * @ignore
         */
        Object.defineProperty(this, "collisionForce", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: d3Force.forceCollide(20)
        });
        /**
         * @ignore
         */
        Object.defineProperty(this, "linkForce", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: d3Force.forceLink()
        });
        Object.defineProperty(this, "_nodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_links", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_tick", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_nodesDirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    _afterNew() {
        super._afterNew();
        this.d3forceSimulation.on("tick", () => {
            this._tick++;
            this.updateNodePositions();
        });
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isDirty("showOnFrame")) {
            const showOnFrame = this.get("showOnFrame");
            if (showOnFrame > this._tick) {
                this.nodesContainer.setPrivate("visible", false);
                this.linksContainer.setPrivate("visible", false);
            }
        }
        const d3forceSimulation = this.d3forceSimulation;
        if (this.isDirty("velocityDecay")) {
            d3forceSimulation.velocityDecay(this.get("velocityDecay", 0));
        }
        if (this.isDirty("initialFrames")) {
            d3forceSimulation.alphaDecay(1 - Math.pow(0.001, 1 / this.get("initialFrames", 500)));
        }
    }
    /**
     * @ignore
     */
    restartSimulation(alpha) {
        const d3forceSimulation = this.d3forceSimulation;
        if (d3forceSimulation.alpha() < .25) {
            d3forceSimulation.alpha(alpha);
            d3forceSimulation.restart();
        }
    }
    _handleRadiusChange() {
        this._updateForces();
    }
    processDataItem(dataItem) {
        const d3ForceNode = { index: this._index, x: this.innerWidth() / 2, y: this.innerHeight() / 2, dataItem: dataItem };
        const index = this._nodes.push(d3ForceNode) - 1;
        d3ForceNode.index = index;
        this.d3forceSimulation.nodes(this._nodes);
        dataItem.set("d3ForceNode", d3ForceNode);
        super.processDataItem(dataItem);
        const node = dataItem.get("node");
        node.set("x", -10000);
        node.on("scale", () => {
            this._updateForces();
        });
        node.events.on("dragged", () => {
            d3ForceNode.fx = node.x();
            d3ForceNode.fy = node.y();
            this._updateForces();
        });
        node.events.on("dragstop", () => {
            if (dataItem.get("x") == null) {
                d3ForceNode.fx = undefined;
            }
            if (dataItem.get("y") == null) {
                d3ForceNode.fy = undefined;
            }
        });
    }
    _updateValues(d3HierarchyNode) {
        super._updateValues(d3HierarchyNode);
        this._nodesDirty = true;
        const d3forceSimulation = this.d3forceSimulation;
        d3forceSimulation.force("collision", this.collisionForce);
        d3forceSimulation.nodes(this._nodes);
        this.linkForce = d3Force.forceLink(this._links);
        d3forceSimulation.force("link", this.linkForce);
    }
    _updateVisuals() {
        super._updateVisuals();
        this.restartSimulation(.3);
    }
    _updateChildren() {
        super._updateChildren();
        const d3forceSimulation = this.d3forceSimulation;
        if (this._sizeDirty) {
            let w = Math.max(50, this.innerWidth());
            let h = Math.max(50, this.innerHeight());
            let pt = this.get("paddingTop", 0);
            let pl = this.get("paddingLeft", 0);
            let centerStrength = this.get("centerStrength", 1);
            d3forceSimulation.force("x", d3Force.forceX().x(w / 2 + pl).strength(centerStrength * 100 / w));
            d3forceSimulation.force("y", d3Force.forceY().y(h / 2 + pt).strength(centerStrength * 100 / h));
        }
        if (this._nodesDirty) {
            this._updateForces();
        }
    }
    _updateForces() {
        const d3forceSimulation = this.d3forceSimulation;
        d3forceSimulation.force("manybody", d3Force.forceManyBody().strength((d3node) => {
            let dataItem = d3node.dataItem;
            let node = dataItem.get("node");
            let circle = dataItem.get("circle");
            let manyBodyStrength = this.get("manyBodyStrength", -15);
            if (circle) {
                return circle.get("radius", 1) * node.get("scale", 1) * manyBodyStrength;
            }
            return 0;
        }));
        this.collisionForce.radius((d3node) => {
            let dataItem = d3node.dataItem;
            let node = dataItem.get("node");
            let circle = dataItem.get("circle");
            let outerCircle = dataItem.get("outerCircle");
            if (circle && outerCircle) {
                let radius = circle.get("radius", 1);
                if (!outerCircle.isHidden()) {
                    radius = radius * outerCircle.get("scale", 1.1);
                }
                radius *= node.get("scale", 1);
                return radius + this.get("nodePadding", 0);
            }
        });
        this.restartSimulation(0.3);
    }
    _animatePositions(_dataItem) {
        // void, do not remove
    }
    _clearDirty() {
        super._clearDirty();
        this._nodesDirty = false;
    }
    /**
     * @ignore
     */
    updateNodePositions() {
        const linkForce = this.linkForce;
        if (linkForce) {
            linkForce.distance((linkDatum) => {
                return this.getDistance(linkDatum);
            });
            linkForce.strength((linkDatum) => {
                return this.getStrength(linkDatum);
            });
        }
        if (this._tick == this.get("showOnFrame")) {
            this.nodesContainer.setPrivate("visible", true);
            this.linksContainer.setPrivate("visible", true);
        }
        let d3Nodes = this.d3forceSimulation.nodes();
        $array.each(d3Nodes, (d3Node) => {
            const dataItem = d3Node.dataItem;
            const node = dataItem.get("node");
            node.set("x", d3Node.x);
            node.set("y", d3Node.y);
        });
    }
    /**
     * @ignore
     */
    updateLinkWith(dataItems) {
        $array.each(dataItems, (dataItem) => {
            const linkWith = dataItem.get("linkWith");
            if (linkWith) {
                $array.each(linkWith, (id) => {
                    const linkWithDataItem = this._getDataItemById(this.dataItems, id);
                    if (linkWithDataItem) {
                        this.linkDataItems(dataItem, linkWithDataItem, this.get("linkWithStrength"));
                    }
                });
            }
            const children = dataItem.get("children");
            if (children) {
                this.updateLinkWith(children);
            }
        });
    }
    /**
     * @ignore
     */
    getDistance(linkDatum) {
        let sourceDataItem = linkDatum.sourceDataItem;
        let targetDataItem = linkDatum.targetDataItem;
        let distance = 0;
        if (sourceDataItem && targetDataItem) {
            const targetNode = targetDataItem.get("node");
            if (targetNode.isHidden()) {
                return 0;
            }
            let link = linkDatum.link;
            if (link) {
                distance = link.get("distance", 1);
            }
            const sourceNode = sourceDataItem.get("node");
            if (targetNode.isHidden()) {
                distance = 1;
            }
            return (distance * (sourceDataItem.get("circle").get("radius", 1) * sourceNode.get("scale", 1) + targetDataItem.get("circle").get("radius", 1) * targetNode.get("scale", 1)));
        }
        return distance;
    }
    /**
     * @ignore
     */
    getStrength(linkDatum) {
        let strength = 0;
        let link = linkDatum.link;
        if (link) {
            strength = link.get("strength", 1);
        }
        const targetDataItem = linkDatum.targetDataItem;
        strength *= targetDataItem.get("node").get("scale");
        return strength;
    }
    _updateNode(dataItem) {
        super._updateNode(dataItem);
        this._updateRadius(dataItem);
        const x = dataItem.get("x");
        const y = dataItem.get("y");
        const d3Node = dataItem.get("d3ForceNode");
        if (x != null) {
            d3Node.fx = $utils.relativeToValue(x, this.innerWidth());
        }
        else {
            d3Node.fx = undefined;
        }
        if (y != null) {
            d3Node.fy = $utils.relativeToValue(y, this.innerHeight());
        }
        else {
            d3Node.fx = undefined;
        }
    }
    _updateRadius(dataItem) {
        let size = (this.innerWidth() + this.innerHeight()) / 2;
        let minRadius = $utils.relativeToValue(this.get("minRadius", 1), size);
        let maxRadius = $utils.relativeToValue(this.get("maxRadius", 5), size);
        let valueWorking = dataItem.get("sum");
        let radius = maxRadius;
        const min = this.getPrivate("valueLow", 0);
        const max = this.getPrivate("valueHigh", 0);
        if (max > 0) {
            radius = minRadius + (valueWorking - min) / (max - min) * (maxRadius - minRadius);
        }
        if (!$type.isNumber(radius)) {
            radius = minRadius;
        }
        const duration = this.get("animationDuration", 0);
        const easing = this.get("animationEasing");
        dataItem.get("circle").animate({ key: "radius", to: radius, duration: duration, easing: easing });
    }
    _processLink(link, source, target) {
        const d3Link = { link: link, source: source.get("d3ForceNode").index, target: target.get("d3ForceNode").index, sourceDataItem: source, targetDataItem: target };
        this._links.push(d3Link);
        link.setPrivate("d3Link", d3Link);
        this.linkForce = d3Force.forceLink(this._links);
        this.d3forceSimulation.force("link", this.linkForce);
        this.restartSimulation(0.5);
    }
    _disposeLink(link) {
        super._disposeLink(link);
        $array.remove(this._links, link.getPrivate("d3Link"));
    }
    _handleUnlink() {
        this.restartSimulation(0.5);
    }
    _onDataClear() {
        super._onDataClear();
        this._nodes = [];
        this._links = [];
    }
}
Object.defineProperty(ForceDirected, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ForceDirected"
});
Object.defineProperty(ForceDirected, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: LinkedHierarchy.classNames.concat([ForceDirected.className])
});
//# sourceMappingURL=ForceDirected.js.map
import { Hierarchy } from "./Hierarchy";
import { Container } from "../../core/render/Container";
import { LinkedHierarchyNode } from "./LinkedHierarchyNode";
import { HierarchyLink } from "./HierarchyLink";
import { Template } from "../../core/util/Template";
import { Circle } from "../../core/render/Circle";
import { ListTemplate } from "../../core/util/List";
import * as $array from "../../core/util/Array";
import * as $utils from "../../core/util/Utils";
;
/**
 * A base class for linked hierarchy series.
 */
export class LinkedHierarchy extends Hierarchy {
    constructor() {
        super(...arguments);
        /**
         * A list of nodes in a [[LinkedHierarchy]] chart.
         *
         * @default new ListTemplate<LinkedHierarchyNode>
         */
        Object.defineProperty(this, "nodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => LinkedHierarchyNode._new(this._root, {
                themeTags: $utils.mergeTags(this.nodes.template.get("themeTags", []), [this._tag, "linkedhierarchy", "hierarchy", "node"]),
                x: this.width() / 2,
                y: this.height() / 2
            }, [this.nodes.template]))
        });
        /**
         * A list of node circle elements in a [[LinkedHierarchy]] chart.
         *
         * @default new ListTemplate<Circle>
         */
        Object.defineProperty(this, "circles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Circle._new(this._root, {
                themeTags: $utils.mergeTags(this.circles.template.get("themeTags", []), [this._tag, "shape"])
            }, [this.circles.template]))
        });
        /**
         * A list of node outer circle elements in a [[LinkedHierarchy]] chart.
         *
         * @default new ListTemplate<Circle>
         */
        Object.defineProperty(this, "outerCircles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Circle._new(this._root, {
                themeTags: $utils.mergeTags(this.outerCircles.template.get("themeTags", []), [this._tag, "outer", "shape"])
            }, [this.outerCircles.template]))
        });
        /**
         * A list of link elements in a [[LinkedHierarchy]] chart.
         *
         * @default new ListTemplate<HierarchyLink>
         */
        Object.defineProperty(this, "links", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => HierarchyLink._new(this._root, {
                themeTags: $utils.mergeTags(this.links.template.get("themeTags", []), [this._tag, "linkedhierarchy", "hierarchy", "link"])
            }, [this.links.template]))
        });
        /**
         * A [[Container]] that link elements are placed in.
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "linksContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.moveValue(Container.new(this._root, {}), 0)
        });
    }
    _afterNew() {
        this.fields.push("linkWith", "x", "y");
        super._afterNew();
    }
    /**
     * @ignore
     */
    makeNode(dataItem) {
        const node = super.makeNode(dataItem);
        const circle = node.children.moveValue(this.circles.make(), 0);
        this.circles.push(circle);
        node.setPrivate("tooltipTarget", circle);
        dataItem.setRaw("circle", circle);
        const outerCircle = node.children.moveValue(this.outerCircles.make(), 0);
        this.outerCircles.push(outerCircle);
        dataItem.setRaw("outerCircle", outerCircle);
        const label = dataItem.get("label");
        circle.on("radius", () => {
            const d = circle.get("radius", this.width()) * 2;
            label.setAll({ maxWidth: d, maxHeight: d });
            outerCircle.set("radius", d / 2);
            this._handleRadiusChange();
        });
        const d = circle.get("radius", this.width()) * 2;
        label.setAll({ maxWidth: d, maxHeight: d });
        circle._setDataItem(dataItem);
        outerCircle._setDataItem(dataItem);
        return node;
    }
    _handleRadiusChange() {
    }
    processDataItem(dataItem) {
        dataItem.setRaw("childLinks", []);
        dataItem.setRaw("links", []);
        super.processDataItem(dataItem);
    }
    _processDataItem(dataItem) {
        super._processDataItem(dataItem);
        const parentDataItem = dataItem.get("parent");
        if (parentDataItem && parentDataItem.get("depth") >= this.get("topDepth")) {
            const link = this.linkDataItems(parentDataItem, dataItem);
            dataItem.setRaw("parentLink", link);
        }
        const node = dataItem.get("node");
        this.updateLinkWith(this.dataItems);
        node._updateLinks(0);
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
                        this.linkDataItems(dataItem, linkWithDataItem);
                    }
                });
            }
            const children = dataItem.get("children");
            if (children) {
                this.updateLinkWith(children);
            }
        });
    }
    _getPoint(hierarchyNode) {
        return { x: hierarchyNode.x, y: hierarchyNode.y };
    }
    _animatePositions(dataItem) {
        const node = dataItem.get("node");
        const hierarchyNode = dataItem.get("d3HierarchyNode");
        const point = this._getPoint(hierarchyNode);
        const duration = this.get("animationDuration", 0);
        const easing = this.get("animationEasing");
        node.animate({ key: "x", to: point.x, duration: duration, easing: easing });
        node.animate({ key: "y", to: point.y, duration: duration, easing: easing });
    }
    _updateNode(dataItem) {
        super._updateNode(dataItem);
        this._animatePositions(dataItem);
        const hierarchyNode = dataItem.get("d3HierarchyNode");
        const hierarchyChildren = hierarchyNode.children;
        if (hierarchyChildren) {
            $array.each(hierarchyChildren, (hierarchyChild) => {
                this._updateNodes(hierarchyChild);
            });
        }
        const fill = dataItem.get("fill");
        const circle = dataItem.get("circle");
        const children = dataItem.get("children");
        if (circle) {
            circle._setDefault("fill", fill);
            circle._setDefault("stroke", fill);
        }
        const outerCircle = dataItem.get("outerCircle");
        if (outerCircle) {
            outerCircle._setDefault("fill", fill);
            outerCircle._setDefault("stroke", fill);
            if (!children || children.length == 0) {
                outerCircle.setPrivate("visible", false);
            }
        }
    }
    /**
     * Link two data items with a link element.
     *
     * @param   source    Source node data item
     * @param   target    Target node data item
     * @param   strength  Link strength
     * @return            Link element
     */
    linkDataItems(source, target, strength) {
        let link;
        const sourceLinks = source.get("links");
        if (sourceLinks) {
            $array.each(sourceLinks, (lnk) => {
                if (lnk.get("target") == target) {
                    link = lnk;
                }
            });
        }
        const targetLinks = target.get("links");
        if (targetLinks) {
            $array.each(targetLinks, (lnk) => {
                if (lnk.get("target") == source) {
                    link = lnk;
                }
            });
        }
        if (!link) {
            link = this.links.make();
            this.links.push(link);
            this.linksContainer.children.push(link);
            link.set("source", source);
            link.set("target", target);
            link._setDataItem(source);
            link.set("stroke", source.get("fill"));
            if (strength != null) {
                link.set("strength", strength);
            }
            source.get("childLinks").push(link);
            $array.move(source.get("links"), link);
            $array.move(target.get("links"), link);
            this._processLink(link, source, target);
        }
        return link;
    }
    /**
     * Unlink two linked data items.
     *
     * @param   source  Source node data item
     * @param   target  Target node data item
     */
    unlinkDataItems(source, target) {
        let link;
        const sourceLinks = source.get("links");
        if (sourceLinks) {
            $array.each(sourceLinks, (lnk) => {
                if (lnk && lnk.get("target") == target) {
                    link = lnk;
                    $array.remove(sourceLinks, link);
                }
            });
        }
        const targetLinks = target.get("links");
        if (targetLinks) {
            $array.each(targetLinks, (lnk) => {
                if (lnk && lnk.get("target") == source) {
                    link = lnk;
                    $array.remove(targetLinks, link);
                }
            });
        }
        if (link) {
            this._disposeLink(link);
        }
        this._handleUnlink();
    }
    _handleUnlink() {
    }
    _disposeLink(link) {
        this.links.removeValue(link);
        link.dispose();
    }
    /**
     * Returns `true` if two nodes are linked with each other.
     */
    areLinked(source, target) {
        const sourceLinks = source.get("links");
        let linked = false;
        if (sourceLinks) {
            $array.each(sourceLinks, (lnk) => {
                if (lnk.get("target") == target) {
                    linked = true;
                }
            });
        }
        const targetLinks = target.get("links");
        if (targetLinks) {
            $array.each(targetLinks, (lnk) => {
                if (lnk.get("target") == source) {
                    linked = true;
                }
            });
        }
        return linked;
    }
    _processLink(_link, _source, _target) {
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        const links = dataItem.get("links");
        if (links) {
            $array.each(links, (link) => {
                this._disposeLink(link);
            });
        }
    }
    /**
     * Select a data item.
     * @param  dataItem  Data item
     */
    selectDataItem(dataItem) {
        const parent = dataItem.get("parent");
        if (!dataItem.get("disabled")) {
            this.set("selectedDataItem", dataItem);
        }
        else {
            if (parent) {
                this.setRaw("selectedDataItem", parent);
                const type = "dataitemselected";
                this.events.dispatch(type, { type: type, target: this, dataItem: parent });
                this.disableDataItem(dataItem);
            }
        }
    }
}
Object.defineProperty(LinkedHierarchy, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "LinkedHierarchy"
});
Object.defineProperty(LinkedHierarchy, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Hierarchy.classNames.concat([LinkedHierarchy.className])
});
//# sourceMappingURL=LinkedHierarchy.js.map
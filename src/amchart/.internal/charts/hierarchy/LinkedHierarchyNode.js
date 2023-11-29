import { HierarchyNode } from "./HierarchyNode";
import * as $array from "../../core/util/Array";
/**
 * A node class for [[LinkedHierarchy]].
 */
export class LinkedHierarchyNode extends HierarchyNode {
    _afterNew() {
        super._afterNew();
        this.states.create("disabled", {});
        this.states.create("hover", {});
        this.states.create("hoverDisabled", {});
    }
    _updateLinks(duration) {
        const dataItem = this.dataItem;
        if (dataItem) {
            let links = dataItem.get("links");
            $array.each(links, (link) => {
                let source = link.get("source");
                let target = link.get("target");
                if (source && target) {
                    if (source.get("node").isHidden() || target.get("node").isHidden()) {
                        link.hide(duration);
                    }
                    else {
                        link.show(duration);
                    }
                }
            });
        }
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isDirty("disabled")) {
            this._updateLinks();
        }
    }
    _onHide(duration) {
        super._onHide(duration);
        this._updateLinks(duration);
    }
    _onShow(duration) {
        super._onShow(duration);
        this._updateLinks(duration);
    }
}
Object.defineProperty(LinkedHierarchyNode, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "LinkedHierarchyNode"
});
Object.defineProperty(LinkedHierarchyNode, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: HierarchyNode.classNames.concat([LinkedHierarchyNode.className])
});
//# sourceMappingURL=LinkedHierarchyNode.js.map
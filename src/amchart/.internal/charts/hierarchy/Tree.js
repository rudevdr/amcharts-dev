import { LinkedHierarchy } from "./LinkedHierarchy";
import * as d3hierarchy from "d3-hierarchy";
;
/**
 * Displays a tree diagram.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/tree/} for more info
 * @important
 */
export class Tree extends LinkedHierarchy {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "tree"
        });
        Object.defineProperty(this, "_hierarchyLayout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: d3hierarchy.tree()
        });
        Object.defineProperty(this, "_packData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isDirty("orientation") || this.isDirty("inversed")) {
            this._updateVisuals();
        }
    }
    _updateVisuals() {
        if (this._rootNode) {
            const layout = this._hierarchyLayout;
            if (this.get("orientation") == "vertical") {
                layout.size([this.innerWidth(), this.innerHeight()]);
            }
            else {
                layout.size([this.innerHeight(), this.innerWidth()]);
            }
            layout(this._rootNode);
        }
        super._updateVisuals();
    }
    _getPoint(hierarchyNode) {
        const inversed = this.get("inversed");
        if (this.get("orientation") == "vertical") {
            if (inversed) {
                return { x: hierarchyNode.x, y: this.innerHeight() - hierarchyNode.y };
            }
            else {
                return { x: hierarchyNode.x, y: hierarchyNode.y };
            }
        }
        else {
            if (inversed) {
                return { x: this.innerWidth() - hierarchyNode.y, y: hierarchyNode.x };
            }
            else {
                return { x: hierarchyNode.y, y: hierarchyNode.x };
            }
        }
    }
}
Object.defineProperty(Tree, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Tree"
});
Object.defineProperty(Tree, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: LinkedHierarchy.classNames.concat([Tree.className])
});
//# sourceMappingURL=Tree.js.map
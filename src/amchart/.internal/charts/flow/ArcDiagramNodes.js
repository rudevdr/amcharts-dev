import { FlowNodes } from "./FlowNodes";
import { Circle } from "../../core/render/Circle";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import { Label } from "../../core/render/Label";
;
;
;
/**
 * Holds instances of nodes for a [[ArcDiagram]] series.
 */
export class ArcDiagramNodes extends FlowNodes {
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
            value: new ListTemplate(Template.new({}), () => Label._new(this._root, {}, [this.labels.template]))
        });
        /**
         * Related [[ArcDiagram]] series.
         */
        Object.defineProperty(this, "flow", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_dAngle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        /**
         * List of slice elements.
         *
         * @default new ListTemplate<Slice>
         */
        Object.defineProperty(this, "circles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Circle._new(this._root, { themeTags: ["shape"] }, [this.circles.template]))
        });
    }
    /**
     * @ignore
     */
    makeNode(dataItem) {
        const node = super.makeNode(dataItem, "ArcDiagram");
        const circle = node.children.insertIndex(0, this.circles.make());
        dataItem.set("circle", circle);
        circle._setSoft("fill", dataItem.get("fill"));
        const label = this.labels.make();
        this.labels.push(label);
        label.addTag("flow");
        label.addTag("arcdiagram");
        label.addTag("node");
        node.children.push(label);
        dataItem.set("label", label);
        label._setDataItem(dataItem);
        circle._setDataItem(dataItem);
        return node;
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        let circle = dataItem.get("circle");
        if (circle) {
            this.circles.removeValue(circle);
            circle.dispose();
        }
    }
    _updateNodeColor(dataItem) {
        const circle = dataItem.get("circle");
        if (circle) {
            circle.set("fill", dataItem.get("fill"));
        }
    }
}
Object.defineProperty(ArcDiagramNodes, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ArcDiagramNodes"
});
Object.defineProperty(ArcDiagramNodes, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: FlowNodes.classNames.concat([ArcDiagramNodes.className])
});
//# sourceMappingURL=ArcDiagramNodes.js.map
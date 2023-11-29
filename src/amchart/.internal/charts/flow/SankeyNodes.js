import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import { FlowNodes } from "./FlowNodes";
import { RoundedRectangle } from "../../core/render/RoundedRectangle";
/**
 * Holds instances of nodes for a [[Sankey]] series.
 */
export class SankeyNodes extends FlowNodes {
    constructor() {
        super(...arguments);
        /**
         * List of rectangle elements.
         *
         * @default new ListTemplate<RoundedRectangle>
         */
        Object.defineProperty(this, "rectangles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => RoundedRectangle._new(this._root, { themeTags: ["shape"] }, [this.rectangles.template]))
        });
        /**
         * Related [[Sankey]] series.
         */
        Object.defineProperty(this, "flow", {
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
        const flow = this.flow;
        const node = super.makeNode(dataItem, "sankey");
        const rectangle = node.children.insertIndex(0, this.rectangles.make());
        this.rectangles.push(rectangle);
        rectangle._setSoft("fill", dataItem.get("fill"));
        dataItem.set("rectangle", rectangle);
        node.events.on("dragged", () => {
            const d3SankeyNode = node.dataItem.get("d3SankeyNode");
            if (d3SankeyNode) {
                if (flow) {
                    if (flow.get("orientation") == "horizontal") {
                        d3SankeyNode.x0 = node.x();
                        d3SankeyNode.y0 = node.y();
                    }
                    else {
                        d3SankeyNode.x0 = node.y();
                        d3SankeyNode.y0 = node.x();
                    }
                    flow.updateSankey();
                }
            }
        });
        const label = this.labels.make();
        this.labels.push(label);
        if (flow) {
            label.addTag(flow.get("orientation", ""));
        }
        node.children.push(label);
        dataItem.set("label", label);
        label._setDataItem(dataItem);
        rectangle._setDataItem(dataItem);
        return node;
    }
    _positionBullet(bullet) {
        const sprite = bullet.get("sprite");
        if (sprite) {
            const dataItem = sprite.dataItem;
            if (dataItem) {
                const sprite = bullet.get("sprite");
                if (sprite) {
                    const rectangle = dataItem.get("rectangle");
                    const node = dataItem.get("node");
                    const locationX = bullet.get("locationX", 0.5);
                    const locationY = bullet.get("locationY", 0.5);
                    if (rectangle) {
                        sprite.setAll({ x: node.x() + rectangle.width() * locationX, y: node.y() + rectangle.height() * locationY });
                    }
                }
            }
        }
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        let rectangle = dataItem.get("rectangle");
        if (rectangle) {
            this.rectangles.removeValue(rectangle);
            rectangle.dispose();
        }
    }
    _updateNodeColor(dataItem) {
        const rectangle = dataItem.get("rectangle");
        if (rectangle) {
            rectangle.set("fill", dataItem.get("fill"));
        }
    }
}
Object.defineProperty(SankeyNodes, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "SankeyNodes"
});
Object.defineProperty(SankeyNodes, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: FlowNodes.classNames.concat([SankeyNodes.className])
});
//# sourceMappingURL=SankeyNodes.js.map
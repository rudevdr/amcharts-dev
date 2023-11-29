import { FlowNodes } from "./FlowNodes";
import { Slice } from "../../core/render/Slice";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import { RadialLabel } from "../../core/render/RadialLabel";
import * as $math from "../../core/util/Math";
/**
 * Holds instances of nodes for a [[Chord]] series.
 */
export class ChordNodes extends FlowNodes {
    constructor() {
        super(...arguments);
        /**
         * List of label elements.
         *
         * @default new ListTemplate<RadialLabel>
         */
        Object.defineProperty(this, "labels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => RadialLabel._new(this._root, {}, [this.labels.template]))
        });
        /**
         * Related [[Chord]] series.
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
        Object.defineProperty(this, "slices", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Slice._new(this._root, { themeTags: ["shape"] }, [this.slices.template]))
        });
        /**
         * @ignore
         * added to solve old naming bug
         */
        Object.defineProperty(this, "rectangles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.slices
        });
    }
    /**
     * @ignore
     */
    makeNode(dataItem) {
        const node = super.makeNode(dataItem, "chord");
        const slice = node.children.insertIndex(0, this.slices.make());
        dataItem.set("slice", slice);
        slice._setSoft("fill", dataItem.get("fill"));
        const label = this.labels.make();
        this.labels.push(label);
        label.addTag("flow");
        label.addTag("chord");
        label.addTag("node");
        node.children.push(label);
        dataItem.set("label", label);
        node.events.on("dragstart", (e) => {
            let point = this.toLocal(e.point);
            const angle = $math.getAngle({ x: 0, y: 0 }, point);
            if (this.flow) {
                this._dAngle = this.flow.get("startAngle", 0) - angle;
            }
        });
        node.events.on("dragged", (e) => {
            let point = this.toLocal(e.point);
            const angle = $math.getAngle({ x: 0, y: 0 }, point);
            node.setAll({ x: 0, y: 0 });
            if (this.flow) {
                this.flow.set("startAngle", angle + this._dAngle);
            }
        });
        label._setDataItem(dataItem);
        slice._setDataItem(dataItem);
        return node;
    }
    _positionBullet(bullet) {
        const sprite = bullet.get("sprite");
        if (sprite) {
            const dataItem = sprite.dataItem;
            if (dataItem) {
                const sprite = bullet.get("sprite");
                if (sprite) {
                    const slice = dataItem.get("slice");
                    const locationX = bullet.get("locationX", 0.5);
                    const locationY = bullet.get("locationY", 0.5);
                    if (slice) {
                        const radius = slice.get("radius", 0);
                        const innerRadius = slice.get("innerRadius", 0);
                        const bulletRadius = innerRadius + (radius - innerRadius) * locationY;
                        const angle = slice.get("startAngle", 0) + slice.get("arc", 0) * locationX;
                        sprite.setAll({ x: bulletRadius * $math.cos(angle), y: bulletRadius * $math.sin(angle) });
                    }
                }
            }
        }
    }
    _updateNodeColor(dataItem) {
        const slice = dataItem.get("slice");
        if (slice) {
            slice.set("fill", dataItem.get("fill"));
        }
    }
    /**
     * @ignore
     */
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        let slice = dataItem.get("slice");
        if (slice) {
            this.slices.removeValue(slice);
            slice.dispose();
        }
    }
}
Object.defineProperty(ChordNodes, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ChordNodes"
});
Object.defineProperty(ChordNodes, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: FlowNodes.classNames.concat([ChordNodes.className])
});
//# sourceMappingURL=ChordNodes.js.map
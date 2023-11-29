import { Graphics } from "../../core/render/Graphics";
/**
 * Draws a link between nodes in a hierarchy series.
 */
export class HierarchyLink extends Graphics {
    _changed() {
        super._changed();
        if (this._clear) {
            let source = this.get("source");
            let target = this.get("target");
            if (source && target) {
                const sourceNode = source.get("node");
                const targetNode = target.get("node");
                this._display.moveTo(sourceNode.x(), sourceNode.y());
                this._display.lineTo(targetNode.x(), targetNode.y());
            }
        }
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("source")) {
            const source = this.get("source");
            if (source) {
                const sourceNode = source.get("node");
                sourceNode.events.on("positionchanged", () => {
                    this._markDirtyKey("stroke");
                });
            }
        }
        if (this.isDirty("target")) {
            const target = this.get("target");
            if (target) {
                const targetNode = target.get("node");
                targetNode.events.on("positionchanged", () => {
                    this._markDirtyKey("stroke");
                });
            }
        }
    }
}
Object.defineProperty(HierarchyLink, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "HierarchyLink"
});
Object.defineProperty(HierarchyLink, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Graphics.classNames.concat([HierarchyLink.className])
});
//# sourceMappingURL=HierarchyLink.js.map
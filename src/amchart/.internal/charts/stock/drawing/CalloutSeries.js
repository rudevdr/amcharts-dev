import { LabelSeries } from "./LabelSeries";
import { PointedRectangle } from "../../../core/render/PointedRectangle";
import { Template } from "../../../core/util/Template";
import * as $ease from "../../../core/util/Ease";
export class CalloutSeries extends LabelSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "callout"
        });
    }
    _tweakBullet2(label, dataItem) {
        const dataContext = dataItem.dataContext;
        label.set("background", PointedRectangle.new(this._root, { themeTags: ["callout"] }, dataContext.bgSettings));
    }
    _tweakBullet(container, dataItem) {
        super._tweakBullet(container, dataItem);
        container.events.off("click");
        const dataContext = dataItem.dataContext;
        const template = dataContext.settings;
        const label = this.getPrivate("label");
        if (label) {
            label.events.on("positionchanged", () => {
                this._updatePointer(label);
            });
            label.events.on("click", () => {
                const spriteResizer = this.spriteResizer;
                if (spriteResizer.get("sprite") == label) {
                    spriteResizer.set("sprite", undefined);
                }
                else {
                    spriteResizer.set("sprite", label);
                }
                if (this._erasingEnabled) {
                    this._disposeIndex(dataContext.index);
                }
            });
            label.on("scale", () => {
                this._updatePointer(label);
            });
            label.on("rotation", () => {
                this._updatePointer(label);
            });
            label.setAll({ draggable: true });
            label.on("x", (x) => {
                template.set("x", x);
            });
            label.on("y", (y) => {
                template.set("y", y);
            });
            const defaultState = label.states.lookup("default");
            setTimeout(() => {
                label.animate({ key: "y", to: -label.height() / 2 - 10, from: 0, duration: defaultState.get("stateAnimationDuration", 500), easing: defaultState.get("stateAnimationEasing", $ease.out($ease.cubic)) });
            }, 50);
        }
    }
    _updatePointer(label) {
        const background = label.get("background");
        if (background instanceof PointedRectangle) {
            const parent = label.parent;
            if (parent) {
                let point = parent.toGlobal({ x: 0, y: 0 });
                point = background.toLocal(point);
                background.setAll({ pointerX: point.x, pointerY: point.y });
            }
        }
    }
    _afterTextSave(dataContext) {
        dataContext.bgSettings = this._getBgTemplate();
    }
    _hideAllBullets() {
    }
    _getBgTemplate() {
        const template = {};
        const fill = this.get("fillColor");
        if (fill != null) {
            template.fill = fill;
        }
        return Template.new(template);
    }
}
Object.defineProperty(CalloutSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "CalloutSeries"
});
Object.defineProperty(CalloutSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: LabelSeries.classNames.concat([CalloutSeries.className])
});
//# sourceMappingURL=CalloutSeries.js.map
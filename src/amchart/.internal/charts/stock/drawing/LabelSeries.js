import { PolylineSeries } from "./PolylineSeries";
import { Label } from "../../../core/render/Label";
import { RoundedRectangle } from "../../../core/render/RoundedRectangle";
import { SpriteResizer } from "../../../core/render/SpriteResizer";
import { color } from "../../../core/util/Color";
import { Template } from "../../../core/util/Template";
import * as $utils from "../../../core/util/Utils";
export class LabelSeries extends PolylineSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "spriteResizer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(SpriteResizer.new(this._root, {}))
        });
        Object.defineProperty(this, "_clickEvent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "label"
        });
    }
    _afterNew() {
        super._afterNew();
        this.strokes.template.set("visible", false);
        this.fills.template.set("visible", false);
        this.addTag(this._tag);
        const div = document.createElement("div");
        //div.style.width = "300px";
        div.style.position = "absolute";
        div.style.display = "none";
        div.className = "am5stock-drawing-label-wrapper";
        this._root._inner.appendChild(div);
        this.setPrivate("inputContainer", div);
        const textArea = document.createElement("textarea");
        ;
        //textArea.style.textAlign = "center";
        //textArea.rows = 2;
        textArea.className = "am5stock-drawing-label-input";
        this._disposers.push($utils.addEventListener(textArea, "input", () => {
            textArea.style.height = "auto";
            textArea.style.height = textArea.scrollHeight + "px";
        }, false));
        div.appendChild(textArea);
        div.appendChild(document.createElement("br"));
        this.setPrivate("input", textArea);
        const saveButton = document.createElement("input");
        saveButton.type = "button";
        saveButton.value = this._root.language.translateAny("Save");
        saveButton.className = "am5-modal-button am5-modal-primary";
        this._disposers.push($utils.addEventListener(saveButton, "click", () => {
            this.saveText();
        }));
        div.appendChild(saveButton);
        const cancelButton = document.createElement("input");
        cancelButton.type = "button";
        cancelButton.value = this._root.language.translateAny("Cancel");
        cancelButton.className = "am5-modal-button am5-modal-scondary";
        this._disposers.push($utils.addEventListener(cancelButton, "click", () => {
            this.getPrivate("inputContainer").style.display = "none";
            this.getPrivate("input").value = "";
        }));
        div.appendChild(cancelButton);
    }
    _tweakBullet(container, dataItem) {
        const dataContext = dataItem.dataContext;
        const text = dataContext.text;
        const template = dataContext.settings;
        const label = container.children.push(Label.new(this._root, {
            themeTags: ["label"],
            text: text
        }, template));
        this.setPrivate("label", label);
        container.events.on("click", () => {
            const spriteResizer = this.spriteResizer;
            if (spriteResizer.get("sprite") == label) {
                spriteResizer.set("sprite", undefined);
            }
            else {
                spriteResizer.set("sprite", label);
            }
        });
        container.events.on("pointerover", () => {
            this._isHover = true;
        });
        container.events.on("pointerout", () => {
            this._isHover = false;
        });
        label.on("scale", (scale) => {
            template.set("scale", scale);
        });
        label.on("rotation", (rotation) => {
            template.set("rotation", rotation);
        });
        this._tweakBullet2(label, dataItem);
    }
    _tweakBullet2(label, _dataItem) {
        label.set("background", RoundedRectangle.new(this._root, { fillOpacity: 0, strokeOpacity: 0, fill: color(0xffffff) }));
    }
    _handlePointerClick(event) {
        if (this._drawingEnabled) {
            if (!this._isHover) {
                this._index++;
                this._di[this._index] = {};
                const input = this.getPrivate("input");
                input.value = "";
                this._clickEvent = event;
                const inputDiv = this.getPrivate("inputContainer");
                inputDiv.style.display = "block";
                inputDiv.style.left = (event.point.x) + "px";
                inputDiv.style.top = (event.point.y) + "px";
                input.focus();
                this.spriteResizer.set("sprite", undefined);
            }
        }
    }
    saveText() {
        const clickEvent = this._clickEvent;
        if (clickEvent) {
            const text = this.getPrivate("input").value;
            if (text != undefined) {
                this._addPoint(clickEvent);
                const dataContext = this.data.getIndex(this.data.length - 1);
                dataContext.text = text;
                dataContext.index = this._index;
                dataContext.corner = 0;
                dataContext.settings = this._getLabelTemplate();
                this._afterTextSave(dataContext);
            }
            this.getPrivate("inputContainer").style.display = "none";
        }
    }
    _afterTextSave(_dataContext) {
    }
    _getLabelTemplate() {
        const template = {};
        const labelFontSize = this.get("labelFontSize");
        if (labelFontSize != null) {
            template.fontSize = labelFontSize;
        }
        const labelFontFamily = this.get("labelFontFamily");
        if (labelFontFamily != null) {
            template.fontFamily = labelFontFamily;
        }
        const labelFontWeight = this.get("labelFontWeight");
        if (labelFontWeight != null) {
            template.fontWeight = labelFontWeight;
        }
        const labelFill = this.get("labelFill");
        if (labelFill != null) {
            template.fill = labelFill;
        }
        return Template.new(template);
    }
    disposeDataItem(dataItem) {
        super.disposeDataItem(dataItem);
        this.spriteResizer.set("sprite", undefined);
        this._isHover = false;
    }
    _hideAllBullets() {
    }
}
Object.defineProperty(LabelSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "LabelSeries"
});
Object.defineProperty(LabelSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PolylineSeries.classNames.concat([LabelSeries.className])
});
//# sourceMappingURL=LabelSeries.js.map
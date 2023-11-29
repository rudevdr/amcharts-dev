import { Text } from "../render/Text";
import { p50, p100 } from "../util/Percent";
import { Container } from "./Container";
import * as $array from "../../core/util/Array";
import * as $type from "../../core/util/Type";
/**
 * Creates a label with support for in-line styling and data bindings.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/labels/} for more info
 */
export class Label extends Container {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_text", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_textKeys", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                "text",
                "fill",
                "fillOpacity",
                "textAlign",
                "fontFamily",
                "fontSize",
                "fontStyle",
                "fontWeight",
                "fontStyle",
                "fontVariant",
                "textDecoration",
                "shadowColor",
                "shadowBlur",
                "shadowOffsetX",
                "shadowOffsetY",
                "shadowOpacity",
                // "leading",
                // "letterSpacing",
                "lineHeight",
                "baselineRatio",
                //"padding",
                // "stroke",
                // "strokeThickness",
                // "trim",
                // "wordWrap",
                "direction",
                "textBaseline",
                "oversizedBehavior",
                "breakWords",
                "ellipsis",
                "minScale",
                "populateText",
                "role",
                "ignoreFormatting"
            ]
        });
    }
    /**
     * @ignore Text is not to be used directly
     */
    get text() {
        return this._text;
    }
    _afterNew() {
        super._afterNew();
        this._makeText();
        $array.each(this._textKeys, (property) => {
            const propValue = this.get(property);
            if (propValue != undefined) {
                this._text.set(property, propValue);
            }
        });
        if (this.get("html", "") !== "") {
            this._text.set("text", "");
        }
        this.onPrivate("maxWidth", () => {
            this._setMaxDimentions();
        });
        this.onPrivate("maxHeight", () => {
            this._setMaxDimentions();
        });
    }
    _makeText() {
        this._text = this.children.push(Text.new(this._root, {}));
    }
    _updateChildren() {
        super._updateChildren();
        $array.each(this._textKeys, (property) => {
            this._text.set(property, this.get(property));
        });
        if (this.isDirty("maxWidth")) {
            this._setMaxDimentions();
        }
        if (this.isDirty("maxHeight")) {
            this._setMaxDimentions();
        }
        if (this.isDirty("rotation")) {
            this._setMaxDimentions();
        }
        // Do not show regular text if HTML is used
        if (this.get("html", "") !== "") {
            this._text.set("text", "");
        }
        else {
            this._text.set("text", this.get("text"));
        }
        if (this.isDirty("textAlign") || this.isDirty("width")) {
            const textAlign = this.get("textAlign");
            let x;
            if (this.get("width") != null) {
                if (textAlign == "right") {
                    x = p100;
                }
                else if (textAlign == "center") {
                    x = p50;
                }
                else {
                    x = 0;
                }
            }
            else {
                if (textAlign == "left" || textAlign == "start") {
                    x = this.get("paddingLeft");
                }
                else if (textAlign == "right" || textAlign == "end") {
                    x = -this.get("paddingRight");
                }
            }
            this.text.set("x", x);
        }
    }
    _setMaxDimentions() {
        const rotation = this.get("rotation");
        const vertical = rotation == 90 || rotation == 270 || rotation == -90;
        const maxWidth = this.get("maxWidth", this.getPrivate("maxWidth", Infinity));
        if ($type.isNumber(maxWidth)) {
            this.text.set(vertical ? "maxHeight" : "maxWidth", maxWidth - this.get("paddingLeft", 0) - this.get("paddingRight", 0));
        }
        else {
            this.text.set(vertical ? "maxHeight" : "maxWidth", undefined);
        }
        const maxHeight = this.get("maxHeight", this.getPrivate("maxHeight", Infinity));
        if ($type.isNumber(maxHeight)) {
            this.text.set(vertical ? "maxWidth" : "maxHeight", maxHeight - this.get("paddingTop", 0) - this.get("paddingBottom", 0));
        }
        else {
            this.text.set(vertical ? "maxWidth" : "maxHeight", undefined);
        }
    }
    _setDataItem(dataItem) {
        super._setDataItem(dataItem);
        this._markDirtyKey("text");
        if (this.text.get("populateText")) {
            this.text.markDirtyText();
        }
    }
    /**
     * Returns text with populated placeholders and formatting if `populateText` is
     * set to `true`.
     *
     * @return Populated text
     */
    getText() {
        return this._text._getText();
    }
}
Object.defineProperty(Label, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Label"
});
Object.defineProperty(Label, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Container.classNames.concat([Label.className])
});
//# sourceMappingURL=Label.js.map
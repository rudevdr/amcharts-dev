import { Sprite } from "./Sprite";
import { populateString } from "../util/PopulateString";
import * as $array from "../util/Array";
import { Disposer } from "../util/Disposer";
/**
 * @ignore Text is an internal class. Use Label instead.
 */
export class Text extends Sprite {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "textStyle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._root._renderer.makeTextStyle()
        });
        Object.defineProperty(this, "_display", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._root._renderer.makeText("", this.textStyle)
        });
        Object.defineProperty(this, "_textStyles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
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
                "minScale"
            ]
        });
        Object.defineProperty(this, "_originalScale", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _updateBounds() {
        if (!this.get("text")) {
            let newBounds = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            };
            this._adjustedLocalBounds = newBounds;
        }
        else {
            super._updateBounds();
        }
    }
    _changed() {
        super._changed();
        this._display.clear();
        let textStyle = this.textStyle;
        if (this.isDirty("opacity")) {
            let opacity = this.get("opacity", 1);
            this._display.alpha = opacity;
        }
        if (this.isDirty("text") || this.isDirty("populateText")) {
            this._display.text = this._getText();
            this.markDirtyBounds();
            if (this.get("role") == "tooltip") {
                this._root.updateTooltip(this);
            }
        }
        if (this.isPrivateDirty("tooltipElement")) {
            const tooltipElement = this.getPrivate("tooltipElement");
            if (tooltipElement) {
                this._disposers.push(new Disposer(() => {
                    this._root._removeTooltipElement(this);
                }));
            }
        }
        if (this.isDirty("width")) {
            textStyle.wordWrapWidth = this.width();
            this.markDirtyBounds();
        }
        if (this.isDirty("oversizedBehavior")) {
            textStyle.oversizedBehavior = this.get("oversizedBehavior", "none");
            this.markDirtyBounds();
        }
        if (this.isDirty("breakWords")) {
            textStyle.breakWords = this.get("breakWords", false);
            this.markDirtyBounds();
        }
        if (this.isDirty("ellipsis")) {
            textStyle.ellipsis = this.get("ellipsis");
            this.markDirtyBounds();
        }
        if (this.isDirty("ignoreFormatting")) {
            textStyle.ignoreFormatting = this.get("ignoreFormatting", false);
            this.markDirtyBounds();
        }
        if (this.isDirty("minScale")) {
            textStyle.minScale = this.get("minScale", 0);
            this.markDirtyBounds();
        }
        if (this.isDirty("fill")) {
            let fill = this.get("fill");
            if (fill) {
                textStyle.fill = fill;
            }
        }
        if (this.isDirty("fillOpacity")) {
            let fillOpacity = this.get("fillOpacity", 1);
            if (fillOpacity) {
                textStyle.fillOpacity = fillOpacity;
            }
        }
        if (this.isDirty("maxWidth") || this.isPrivateDirty("maxWidth")) {
            textStyle.maxWidth = this.get("maxWidth", this.getPrivate("maxWidth"));
            this.markDirtyBounds();
        }
        if (this.isDirty("maxHeight") || this.isPrivateDirty("maxHeight")) {
            textStyle.maxHeight = this.get("maxHeight", this.getPrivate("maxHeight"));
            this.markDirtyBounds();
        }
        $array.each(this._textStyles, (styleName) => {
            if (this._dirty[styleName]) {
                textStyle[styleName] = this.get(styleName);
                this.markDirtyBounds();
            }
        });
        textStyle["fontSize"] = this.get("fontSize");
        textStyle["fontFamily"] = this.get("fontFamily");
        this._display.style = textStyle;
        if (this.isDirty("role") && this.get("role") == "tooltip") {
            this._root.updateTooltip(this);
        }
    }
    _getText() {
        const text = this.get("text", "");
        return this.get("populateText") ? populateString(this, text) : text;
    }
    /**
     * Forces the text to be re-evaluated and re-populated.
     */
    markDirtyText() {
        this._display.text = this._getText();
        if (this.get("role") == "tooltip") {
            this._root.updateTooltip(this);
        }
        this.markDirtyBounds();
        this.markDirty();
    }
    _setDataItem(dataItem) {
        super._setDataItem(dataItem);
        if (this.get("populateText")) {
            this.markDirtyText();
        }
    }
    getNumberFormatter() {
        if (this.parent) {
            return this.parent.getNumberFormatter();
        }
        else {
            return super.getNumberFormatter();
        }
    }
    getDateFormatter() {
        if (this.parent) {
            return this.parent.getDateFormatter();
        }
        else {
            return super.getDateFormatter();
        }
    }
    getDurationFormatter() {
        if (this.parent) {
            return this.parent.getDurationFormatter();
        }
        else {
            return super.getDurationFormatter();
        }
    }
}
Object.defineProperty(Text, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Text"
});
Object.defineProperty(Text, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Sprite.classNames.concat([Text.className])
});
//# sourceMappingURL=Text.js.map